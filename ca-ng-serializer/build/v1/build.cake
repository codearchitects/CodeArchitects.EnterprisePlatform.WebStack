/********** ARGUMENTS **********/

readonly var target = Argument("target", "Default");
readonly var rootDir = Argument("root", "../../");
readonly var recipe = Argument("recipe", "recipe.yml");

/********** TOOLS & ADDINS **********/

#addin "Cake.FileHelpers"

#addin nuget:?package=Cake.Yaml&version=2.1.0
#addin nuget:?package=YamlDotNet&version=4.2.1

/********** TYPES **********/

public class EnvKeys
{
  public const string CABakeryBuildNumber = "CA_BAKERY_BUILD_NUMBER";

  public const string AppVeyor = "APPVEYOR";
  public const string AppVeyorBuildVersion = "APPVEYOR_BUILD_VERSION";
  public const string AppVeyorBuildNumber = "APPVEYOR_BUILD_NUMBER";

  public const string TFS = "CA_TFS";
  public const string TFSBuildNumber = "CA_TFS_BUILD_NUMBER";
  public const string TFSBuildVersionNumber = "CA_TFS_BUILD_VERSION_NUMBER";
  public const string TFSBuildVersion = "CA_TFS_BUILD_VERSION";

  public const string CABakeryNpmRegistryAndAuthToken = "CA_BAKERY_NPM_REGISTRY_AND_AUTH_TOKEN";
}

public class CABakeryYamlBuild
{
  public string dist { get; set; }
  public int semantic_version_size { get; set; }
  public string release_notes { get; set; }
}

public class CABakeryYamlComponent
{
  public string name { get; set; }
  public string path { get; set; }
  public CABakeryYamlComponentBuild build { get; set; }
}

public class CABakeryYamlComponentBuild
{
  public string type { get; set; }
  public string dist { get; set; }
}

public class CABakeryYamlBundler
{
  public string name { get; set; }
  public List<String> imports { get; set; }
  public List<CABakeryYamlBundlerOperationSteps> steps { get; set; }
}

public class CABakeryYamlBundlerOperationSteps
{
  public string operation { get; set; }
  public CABakeryYamlBundlerOperationFromTarget from { get; set; }
  public CABakeryYamlBundlerOperationToTarget to { get; set; }
}

public class CABakeryYamlBundlerOperationFromTarget
{
  public string component { get; set; }
  public string context { get; set; }
  public string path { get; set; }
  public string extensions { get; set; }
}

public class CABakeryYamlBundlerOperationToTarget
{
  public string path { get; set; }
  public bool enable_compression { get; set; }
}

public class CABakeryYamlArtifact
{
  public string name { get; set; }
  public string path { get; set; }
  public CABakeryYamlArtifactBundle bundle { get; set; }
  public CABakeryYamlArtifactDeployment deployment { get; set; }
}

public class CABakeryYamlArtifactBundle
{
  public string name { get; set; }
  public bool enable_compression { get; set; }
}

public class CABakeryYamlArtifactDeployment
{
  public string type { get; set; }
  public string script { get; set; }
}

public class CABakeryYaml
{
    public int version { get; set; }
    public string name { get; set; }
    public Dictionary<string,string> environment { get; set; }
    public CABakeryYamlBuild build { get; set; }
    public List<CABakeryYamlComponent> components { get; set; }
    public List<CABakeryYamlBundler> bundlers { get; set; }
    public List<CABakeryYamlArtifact> artifacts { get; set; }
}

/********** FUNCTIONS **********/

Func<CABakeryYaml> caBakeryGetYaml = () => { return DeserializeYamlFromFile<CABakeryYaml>(rootDir + recipe); };

Action caBakeryYamlValidateScript = () =>
{
  var yamlVersion = caBakeryGetYaml().version;
  if (yamlVersion != version)
  {
    throw new Exception(String.Format("The recipe version is not supported (current supported version is {0}).", version));
  }
};

Func<string> caBakeryGetBuildVersionNumber = () =>
{
  if(isTFS)
  {
    return EnvironmentVariable(EnvKeys.TFSBuildVersionNumber);
  }
  else {
    return ParseReleaseNotes(caBakeryYamlGetReleaseNotes()).Version.ToString();
  }
};

Func<string> caBakeryGetBuildNumber = () =>
{
  if(isTFS)
  {
    return EnvironmentVariable(EnvKeys.TFSBuildNumber);
  }
  else if(isAPPVEYOR){
    return EnvironmentVariable(EnvKeys.AppVeyorBuildNumber);
  }
  else {
    return EnvironmentVariable(EnvKeys.CABakeryBuildNumber);
  }
};

Func<string> caBakeryGetBuildVersion = () =>
{
  if (isAPPVEYOR)
  {
    return EnvironmentVariable(EnvKeys.AppVeyorBuildVersion);
  }
  if(caBakeryGetYaml().build.semantic_version_size == 4)
  {
    return caBakeryGetBuildVersionNumber() + "." + caBakeryGetBuildNumber();
  }
  else {
    return caBakeryGetBuildVersionNumber();
  }
};

Func<String> caBakeryYamlGetReleaseNotes = () =>
{
  var file = "ReleaseNotes.md" ;
  if (caBakeryGetYaml().build != null)
  {
    var buildFile = caBakeryGetYaml().build.release_notes;
    file = String.IsNullOrWhiteSpace(buildFile) ? file : buildFile;
  }
  return rootDir + file;
};

Func<string[]> caBakeryYamlLoadEnvironment = () =>
{
  if(caBakeryGetYaml().environment == null)
  {
    return new String[0];
  }
  foreach(var item in caBakeryGetYaml().environment)
  {
    Environment.SetEnvironmentVariable(item.Key, item.Value);
  }
  return caBakeryGetYaml().environment.Keys.ToArray();
};

Action<String, String, String> BuildComponents = (String npmCommand, String yarnCommand, String psCommand) =>
{
  foreach (var component in caBakeryGetYaml().components)
  {
    Information("component: " + component.name);
    if ((component.build.type ?? "").ToLower() == "npm")
    {
      Information("running " + npmCommand);
      var exitCodeWithoutArguments = StartProcess("cmd", new ProcessSettings {
        Arguments = "/c \""+ npmCommand +"\"",
        WorkingDirectory = MakeAbsolute(Directory(rootDir + component.path))
      });
      if (exitCodeWithoutArguments != 0) {
        throw new Exception("Command failed to execute!");
      }
    }
    else if ((component.build.type ?? "").ToLower() == "yarn")
    {
      Information("running " + yarnCommand);
      var exitCodeWithoutArguments = StartProcess("cmd", new ProcessSettings {
        Arguments = "/c \""+ yarnCommand +"\"",
        WorkingDirectory = MakeAbsolute(Directory(rootDir + component.path))
      });
      if (exitCodeWithoutArguments != 0) {
        throw new Exception("Command failed to execute!");
      }
    }
    else if ((component.build.type ?? "").ToLower() == "dotnet")
    {
      var workingDirectory = MakeAbsolute(Directory(rootDir + component.path));
      var psCommandFull = "powershell.exe ./build/v1/ca-cake.ps1 -Target " + psCommand +" -Script .\\build\\v1\\build.cake -Verbosity Diagnostic";
      Information("running " + psCommandFull);
      var exitCodeWithoutArguments = StartProcess("cmd", new ProcessSettings {
        Arguments = "/c \""+ psCommandFull +"\"",
        WorkingDirectory = MakeAbsolute(Directory(rootDir + component.path))
      });
      if (exitCodeWithoutArguments != 0) {
        throw new Exception("Command failed to execute!");
      }
    }
    else
    {
      Information("invalid build type");
    }
  }
};

/********** GLOBAL VARIABLES **********/

readonly int version = 1;

readonly bool isAPPVEYOR = (EnvironmentVariable(EnvKeys.AppVeyor) ?? "").ToUpper() == "TRUE";
readonly bool isTFS = (EnvironmentVariable(EnvKeys.TFS) ?? "").ToUpper() == "TRUE";

readonly DirectoryPath workingDirPath = MakeAbsolute(Directory("."));
readonly DirectoryPath rootDirPath = MakeAbsolute(Directory(rootDir));
readonly string distDir = rootDir + caBakeryGetYaml().build.dist;
readonly DirectoryPath distDirPath = MakeAbsolute(Directory(distDir));

/********** SETUP / TEARDOWN **********/

Setup(context =>
{
    //Executed BEFORE the first task.
    try
    {
      // Validate the version of the recipe.yml file
      caBakeryYamlValidateScript();
      // Load the environment variables
      var envKeys = caBakeryYamlLoadEnvironment();
      Information("[ENVIRONMENT]");
      foreach(var envKey in envKeys)
      {
        Information("- {0}={1}", envKey, EnvironmentVariable(envKey));
      }
      // Logging of the settings
      Information("[SETUP] Build Version {0} of {1}", caBakeryGetBuildVersion(), caBakeryGetYaml().name);
      Information("[WORKING_DIRECTORY] {0}", workingDirPath);
      Information("[ROOT_DIRECTORY] {0}", rootDirPath);
      Information("[DIST_DIRECTORY] {0}", distDirPath);
    }
    catch(Exception exception)
    {
      Error("Build Setup Error: "+ exception.Message);
      throw exception;
    }
});

Teardown(context =>
{
  // Executed AFTER the last task.
  try
  {
    Information("[Teardown] Build Version {0} of {1}", caBakeryGetBuildVersion(), caBakeryGetYaml().name);
  }
  catch(Exception exception)
  {
    Error("Build Setup Error: "+ exception.Message);
    throw exception;
  }
});

/********** TASK TARGETS **********/

Task("Clean")
  .Does(() =>
  {
    Information("Cleaning the dist directory");
    if (DirectoryExists(distDir))
    {
      DeleteDirectory(distDir, new DeleteDirectorySettings {
        Recursive = true,
        Force = true
      });
    }
    BuildComponents("npm run clean", "npm run clean", "Clean");
  })
  .ReportError(exception =>
  {
    Error("Clean Error: "+ exception.Message);
    throw exception;
  });

Task("Setup")
  .Does(() =>
  {
    BuildComponents("npm run setup", "yarn --force", "Setup");
  })
  .ReportError(exception =>
  {
    Error("Setup Error: "+ exception.Message);
    throw exception;
  });

Task("Build")
  .Does(() =>
  {
    BuildComponents("npm run build", "yarn build", "Build");
  })
  .ReportError(exception =>
  {
    Error("Build Error: "+ exception.Message);
    throw exception;
  });

Task("Test")
  .Does(() =>
  {
    BuildComponents("npm run test", "yarn test", "Test");
  })
  .ReportError(exception =>
  {
    Error("Test Error: "+ exception.Message);
    throw exception;
  });

Task("Package")
  .Does(() =>
  {
    foreach (var artifact in caBakeryGetYaml().artifacts)
    {
      Information("creating artifact " + artifact.name);
      var artifactDir = distDir + "/" + artifact.path;
      var artifactDirPath = MakeAbsolute(Directory(artifactDir));
      CreateDirectory(artifactDirPath);
      if (artifact.bundle == null || String.IsNullOrWhiteSpace(artifact.bundle.name))
      {
        Error("invalid bundle!");
      }
      else
      {
        var bundler = caBakeryGetYaml().bundlers.FirstOrDefault(m => m.name == artifact.bundle.name);
        if (bundler.steps == null || bundler.steps.Count() == 0)
        {
          Information("there are no steps to be executed for the bundler " + bundler.name);
        }
        else
        {
          foreach(var step in bundler.steps)
          {
            var operation = step.operation;
            if(operation == "copy")
            {
              var componentName = step.from.component;
              var component = caBakeryGetYaml().components.FirstOrDefault(m => m.name == componentName);
              if (component == null)
              {
                Error("unkown component " + componentName);
                continue;
              }
              var fromPath = rootDir + component.path;
              if (step.from.context == "dist")
              {
                fromPath += "/" + component.build.dist;
              }
              if (!String.IsNullOrWhiteSpace(step.from.path))
              {
                fromPath += "/" + step.from.path;
              }
              var toPath = artifactDir;
              if (!String.IsNullOrWhiteSpace(step.to.path))
              {
                toPath += "/" + step.to.path;
              }

              if (!String.IsNullOrWhiteSpace(step.from.extensions))
              {
                fromPath += "/**/" + step.from.extensions;
                Information("copy files " + fromPath + " to " + toPath);
                CopyFiles(GetFiles(fromPath), toPath);
              }
              else
              {
                if (step.to.enable_compression)
                {
                  Information("copy with compression from " + fromPath + " to " + toPath);
                  var tempName = Guid.NewGuid().ToString();
                  var zipFile = artifactDir + "/" + tempName + ".zip";
                  Zip(fromPath, zipFile);
                  Unzip(zipFile, toPath);
                  DeleteFile(zipFile);
                }
                else
                {
                  Information("copy from " + fromPath + " to " + toPath);
                  CopyDirectory(fromPath, toPath);
                }
              }
            }
            else if(operation == "npm-version-patch")
            {
              var packageJsonPath = artifactDir + "/package.json";
              var packageJsonFile = MakeAbsolute(File(packageJsonPath));
              string text = FileReadText(packageJsonFile);
              text = text.Replace("\"version\": \"0.0.0\"", "\"version\": \"" + caBakeryGetBuildVersion() + "\"");
              text = text.Replace("\"version\":\"0.0.0\"", "\"version\": \"" + caBakeryGetBuildVersion() + "\"");
              FileWriteText(packageJsonFile, text);
            }
            else {
              Error("unkown operation " + operation);
              continue;
            }
          }
        }
        if (artifact.bundle.enable_compression)
        {
          var zipFile = artifactDir + ".zip";
          Zip(artifactDir, zipFile);
          Information("Creating MD5 hash for {0} artifact", zipFile);
          var zipFileHashPath = MakeAbsolute(File(zipFile + ".hash.md5"));
          FileWriteText(zipFileHashPath, CalculateFileHash(zipFile, HashAlgorithm.MD5).ToHex());
        }
        var releaseNotes = caBakeryYamlGetReleaseNotes();
        if (!String.IsNullOrWhiteSpace(releaseNotes))
        {
          CopyFile(releaseNotes, artifactDir + "/RELEASE_NOTES.md");
        }
      }
    }
  })
  .ReportError(exception =>
  {
    Error("Package Error: "+ exception.Message);
    throw exception;
  });

Task("Deploy")
  .Does(() =>
  {
    foreach (var artifact in caBakeryGetYaml().artifacts)
    {
      Information("deploying artifact " + artifact.name);
      var artifactDir = distDir + "/" + artifact.path;
      var deploy = artifact.deployment;
      if (deploy.type != "npm") {
        Information("artifact cannot be deployed");
        continue;
      }
      {
        string[] lines = EnvironmentVariable(EnvKeys.CABakeryNpmRegistryAndAuthToken).Split(
            new[] { "\\r\\n", "\\r", "\\n" },
            StringSplitOptions.None
        );
        var exitCodeWithoutArguments1 = StartProcess("cmd", new ProcessSettings {
          Arguments = "/c \"echo strict-ssl=false >> .npmrc",
          WorkingDirectory = MakeAbsolute(Directory(artifactDir))
        });
        if (exitCodeWithoutArguments1 != 0) {
          throw new Exception("Command failed to execute!");
        }
        foreach(var line in lines)
        {
          var exitCodeWithoutArguments2 = StartProcess("cmd", new ProcessSettings {
            Arguments = "/c \"echo " + line + " >> .npmrc\"",
            WorkingDirectory = MakeAbsolute(Directory(artifactDir))
          });
          if (exitCodeWithoutArguments2 != 0) {
            throw new Exception("Command failed to execute!");
          }
        }
      }
      {
        var exitCodeWithoutArguments = StartProcess("cmd", new ProcessSettings {
          Arguments = "/c \"npm publish\"",
          WorkingDirectory = MakeAbsolute(Directory(artifactDir))
        });
        if (exitCodeWithoutArguments != 0) {
          throw new Exception("Command failed to execute!");
        }
      }
    }
  })
  .ReportError(exception =>
  {
    Error("Deployment Error: "+ exception.Message);
    throw exception;
  });

Task("CI")
  .IsDependentOn("Clean")
  .IsDependentOn("Setup")
  .IsDependentOn("Build")
  .IsDependentOn("Test")
  .Does(() =>
  {
      Information("CI target completed");
  })
  .ReportError(exception =>
  {
    Error("CI Error: "+ exception.Message);
    throw exception;
  });

Task("RC")
  .IsDependentOn("Clean")
  .IsDependentOn("Setup")
  .IsDependentOn("Build")
  .IsDependentOn("Test")
  .IsDependentOn("Package")
  .Does(() =>
  {
      Information("RC target completed");
  })
  .ReportError(exception =>
  {
    Error("RC Error: "+ exception.Message);
    throw exception;
  });

Task("RCDeploy")
  .IsDependentOn("RC")
  .IsDependentOn("Deploy")
  .Does(() =>
  {
      Information("Release target completed");
  })
  .ReportError(exception =>
  {
    Error("Release Error: "+ exception.Message);
    throw exception;
  });

Task("Default")
  .Does(() =>
  {
      Information("Default target completed");
  })
  .ReportError(exception =>
  {
    Error("Default Error: "+ exception.Message);
    throw exception;
  });

RunTarget(target);
