import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mkdir, rm, stat, rename, rmdir } from 'fs/promises';
import { existsSync, mkdirSync, createWriteStream, createReadStream } from 'fs';
import { getExtension, getType } from 'mime';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { StorageFolders } from './storage-folders.enum';

@Injectable()
export class FileHelper {
  private storage: string;
  constructor(private readonly configService: ConfigService) {
    this.storage = this.configService.get('STORAGE_FOLDER') + '/app/public/';
    if (!existsSync(this.storage)) mkdirSync(this.storage, { recursive: true });
    if (
      !existsSync(
        this.configService.get('STORAGE_FOLDER') + '/' + StorageFolders.TEMP,
      )
    ) {
      mkdirSync(
        this.configService.get('STORAGE_FOLDER') + '/' + StorageFolders.TEMP,
      );
    }
    if (!existsSync(this.configService.get('STORAGE_FOLDER') + '/logs'))
      mkdirSync(this.configService.get('STORAGE_FOLDER') + '/logs');
  }

  async save(fileBody, mimetype: string, path: string, randomName = false) {
    if (randomName)
      path += `${Date.now()}-${Math.round(Math.random() * 10000)
        .toString()
        .padStart(5, '0')}`;
    const destination =
      this.configService.get('STORAGE_FOLDER') +
      '/' +
      path +
      '.' +
      getExtension(mimetype);
    const pump = await promisify(pipeline);
    await pump(fileBody, createWriteStream(destination));
    return destination;
  }

  async read(path) {
    if (existsSync(path)) {
      return createReadStream(path);
    } else {
      throw new NotFoundException('exceptions.NOT_FOUND|{"args":["FILE"]}');
    }
  }

  async createFolder(path: string) {
    if (!existsSync(this.storage + path)) {
      await mkdir(this.storage + path, { recursive: true });
    }
    return path;
  }

  async removeFolder(path) {
    await rm(this.storage + path, { recursive: true });
  }

  mimetype(path) {
    try {
      return getType(path);
    } catch {}
  }

  async fileSize(path) {
    const stats = await stat(path);
    return stats?.size;
  }

  async moveTemp(oldPath: string, newPath: string) {
    try {
      if (!oldPath.match(`/${StorageFolders.TEMP}/`)) {
        return oldPath;
      }
      if (
        oldPath.match(
          `${this.configService.get('STORAGE_FOLDER')}/${StorageFolders.TEMP}`,
        )
      ) {
        newPath = 'app/public/' + newPath;
      }
      newPath = oldPath.replace(StorageFolders.TEMP, newPath);
      await rename(oldPath, newPath);
      return newPath;
    } catch (error) {
      throw error;
    }
  }

  async remove(path: string | string[]) {
    try {
      if (typeof path === 'string') {
        await rm(path);
      } else {
        await Promise.all(path.map((filePath) => rm(filePath)));
      }
    } catch {}
  }

  getFullPath(path: string) {
    if (!path) {
      return null;
    }
    return process.env.APP_URL + '/' + path;
  }

  log(type: 'app' | 'db', log: object) {
    const logFile = createWriteStream(
      `${this.configService.get('STORAGE_FOLDER')}/logs/${new Date()
        .toISOString()
        .slice(0, 10)}_${type}.log`,
      { flags: 'a' },
    );
    logFile.write(
      JSON.stringify({ time: new Date().toISOString(), ...log }) + '\n',
    );
  }
}
