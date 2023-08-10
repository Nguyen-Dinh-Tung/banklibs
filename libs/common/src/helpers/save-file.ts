import * as fs from 'fs';
export const saveImage = (file: Express.Multer.File, staticFolder: string) => {
  const path = file.path;
  const fileName = file.filename;
  const type = file.mimetype.split('/').pop().toLowerCase();
  const staticPath = `${staticFolder + fileName}.${type}`;
  const buffer = fs.readFileSync(file.path);

  fs.writeFile(staticPath, buffer, (err) => {
    if (err) throw new Error(err.message);
  });
  fs.unlink(path, (err) => {
    if (err) throw new Error(err.message);
  });
  return staticPath;
};
