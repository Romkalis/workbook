// Упаковывает каждый шаг starters/<проект>/<шаг>/ в public/starters/<проект>-<шаг>.zip.
// Запускается перед сборкой (npm run build → prebuild). Без зависимостей: ZIP пишется вручную через zlib.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const SRC = 'starters';
const OUT = path.join('public', 'starters');
const SKIP = new Set(['node_modules', 'dist', '.DS_Store', 'coverage']);

function listFiles(dir, base = dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (SKIP.has(e.name)) return [];
    const full = path.join(dir, e.name);
    return e.isDirectory() ? listFiles(full, base) : [path.relative(base, full)];
  });
}

/** Минимальный ZIP: deflate для каждого файла, центральный каталог в конце. Формат — PKWARE APPNOTE. */
function zip(entries) {
  const local = [];
  const central = [];
  let offset = 0;
  for (const { name, data } of entries) {
    const nameBuf = Buffer.from(name.split(path.sep).join('/'), 'utf8');
    const packed = zlib.deflateRawSync(data);
    const crc = zlib.crc32(data);
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0);
    header.writeUInt16LE(20, 4); // версия
    header.writeUInt16LE(0x0800, 6); // имена в UTF-8
    header.writeUInt16LE(8, 8); // deflate
    header.writeUInt32LE(0x00210000, 10); // время и дата: 01.01.1980
    header.writeUInt32LE(crc, 14);
    header.writeUInt32LE(packed.length, 18);
    header.writeUInt32LE(data.length, 22);
    header.writeUInt16LE(nameBuf.length, 26);
    local.push(header, nameBuf, packed);

    const dir = Buffer.alloc(46);
    dir.writeUInt32LE(0x02014b50, 0);
    dir.writeUInt16LE(20, 4);
    dir.writeUInt16LE(20, 6);
    dir.writeUInt16LE(0x0800, 8);
    dir.writeUInt16LE(8, 10);
    dir.writeUInt32LE(0x00210000, 12);
    dir.writeUInt32LE(crc, 16);
    dir.writeUInt32LE(packed.length, 20);
    dir.writeUInt32LE(data.length, 24);
    dir.writeUInt16LE(nameBuf.length, 28);
    dir.writeUInt32LE(offset, 42);
    central.push(dir, nameBuf);
    offset += header.length + nameBuf.length + packed.length;
  }
  const centralBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralBuf.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, centralBuf, end]);
}

fs.rmSync(OUT, { recursive: true, force: true });
if (fs.existsSync(SRC)) {
  fs.mkdirSync(OUT, { recursive: true });
  let count = 0;
  for (const project of fs.readdirSync(SRC, { withFileTypes: true }).filter((d) => d.isDirectory())) {
    for (const step of fs.readdirSync(path.join(SRC, project.name), { withFileTypes: true }).filter((d) => d.isDirectory())) {
      const dir = path.join(SRC, project.name, step.name);
      const root = `${project.name}-${step.name}`;
      // Файлы кладём в папку с именем шага: после распаковки не получится каша в «Загрузках».
      const entries = listFiles(dir).map((f) => ({ name: path.join(root, f), data: fs.readFileSync(path.join(dir, f)) }));
      fs.writeFileSync(path.join(OUT, `${root}.zip`), zip(entries));
      count++;
    }
  }
  console.log(`starters: ${count} архивов в ${OUT}`);
}
