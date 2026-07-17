export class FileSystemHelpers{
  /**
   * Returns a string containing the base
   * name of the last component, less any 
   * file extension, in a path.
   * @param path The path specification for
   * the component whose base name is to be returned.
   */
  public static GetBaseName(path: string): string {
    return FileSystemHelpers.GetFileName(path)?.replace(/.[^.]*$/, ''); // remove extension
  }

  /**
   * Returns a string containing the extension
   * name for the last component in a path.
   * @param path The path specification for the
   * component whose extension name is to be returned.
   */
  public static GetExtensionName(path: string): string {
    let fileExt = path?.split('.').pop();
    if (fileExt === path) {
      fileExt = null;
    }
    return fileExt;
  }

  /**
   * Returns the last component of a specified path
   * that is not part of the drive specification.
   * @param pathspec The path (absolute or relative) 
   * to a specific file.
   */
  public static GetFileName(pathspec: string): string {
    return pathspec?.replace(/^.*[\\\/]/, ''); // remove path
  }

  /**
   * Returns a string containing the name of the parent 
   * folder of the last component in a specified path.
   * @param path the path specification for the component
   * whose parent folder name is to be returned.
   */
  public static GetParentFolderName(path: string): string {
    return path?.replace(/[\\\/]{0,1}[^\\\/]*$/, ''); // remove file name or last path segment
  }

  /**
   * Returns the network share name for a specified drive.
   * If drive in path is not a network drive, returns a 
   * zero-length string ("").
   * @param path
   */
  public static GetDriveShareName(path: string): string {
    // match \\root\share
    const drive = path?.match(/^\s*(?<share>(\\\\|\/\/)[a-zA-Z~\s]+(\\|\/)[a-zA-Z~$\s]+)/)?.groups?.share ?? '';
    return drive;
  }

  /**
   * Returns the drive letter of a physical local drive.
   * @param path 
   */
  public static GetDriveLetter(path: string): string{
    // c:\ -> C, c -> C    
    const drive = path?.match(/^\s*(?<drive>[a-zA-Z]*)(\:|(\s$))/)?.groups?.drive ?? '';
    return drive.toUpperCase();
  }
}