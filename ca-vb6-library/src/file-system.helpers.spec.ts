import {FileSystemHelpers} from './file-system.helpers';

describe('FileSystemHelpers test suite', () => {
  test('should be defined', () => {
    const actual = FileSystemHelpers;
    expect(actual).toBeDefined();
  });
  
  test('should get baseName', () => {
    // arrange
    const expectedBaseName = 'file';
    const file = `\\\\root\\folder\\${expectedBaseName}.txt`;
    
    // act
    const actualBaseName = FileSystemHelpers.GetBaseName(file);
    
    // assert
    expect(actualBaseName).toBe(expectedBaseName);
  });
  
  test('should get extension', () => {
    // arrange
    const expectedExtension = 'txt';
    const file = `\\\\root\\folder\\file.${expectedExtension}`;
    
    // act
    const actualExtension = FileSystemHelpers.GetExtensionName(file);
    
    // assert
    expect(actualExtension).toBe(expectedExtension);
  });
  
  test('should get fileName', () => {
    // arrange
    const expectedFilename = 'file.txt';
    const file = `\\\\root\\folder\\${expectedFilename}`;
    
    // act
    const actualFilename = FileSystemHelpers.GetFileName(file);
    
    // assert
    expect(actualFilename).toBe(expectedFilename);
  });
  
  test('should get parent folder', () => {
    // arrange
    const expectedParentFolder = '\\\\root\\parent';
    const path = `${expectedParentFolder}\\folder`;
    
    // act
    const actualParentFolder = FileSystemHelpers.GetParentFolderName(path);
    
    // assert
    expect(actualParentFolder).toBe(expectedParentFolder);
  });

  test('should get drive letter', () => {
    // arrange
    const path = '  c:\\';
    
    // act
    const actual = FileSystemHelpers.GetDriveLetter(path);
    
    // assert
    expect(actual).toBe('C');
  });

  test('should get empty drive letter when path is network path', () => {
    // arrange
    const path = '\\\\root\\share';
    
    // act
    const actual = FileSystemHelpers.GetDriveLetter(path);
    
    // assert
    expect(actual).toBe('');
  });

  test('should get empty drive share name when path is not network path', () => {
    // arrange
    const path = 'c:\\';
    
    // act
    const actual = FileSystemHelpers.GetDriveShareName(path);
    
    // assert
    expect(actual).toBe('');
  });

  test('should get drive share name', () => {
    // arrange
    const path = '\\\\root\\share\\sub';
    
    // act
    const actual = FileSystemHelpers.GetDriveShareName(path);
    
    // assert
    expect(actual).toBe('\\\\root\\share');
  });

  test('should get empty drive share name when network path is incomplete', () => {
    // arrange
    const path = '\\\\root';
    
    // act
    const actual = FileSystemHelpers.GetDriveShareName(path);
    
    // assert
    expect(actual).toBe('');
  });
});