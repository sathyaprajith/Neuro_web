import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import xlsx from 'xlsx';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const excelPath = path.join(projectRoot, 'Student_details.xlsx');
const outputPath = path.join(projectRoot, 'src', 'data', 'team.ts');

const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { raw: false, defval: '' });

function normalizeUrl(value) {
  const text = String(value ?? '').trim();
  if (!text) return undefined;
  const candidate = /^https?:\/\//i.test(text) ? text : `https://${text}`;
  try {
    const url = new URL(candidate);
    return url.protocol === 'https:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

const teamMembers = rows
  .map((row, index) => {
    const name = String(row.Name ?? '').trim();
    const linkedin = normalizeUrl(row['Linkedin link']);
    const github = normalizeUrl(row['Github link']);
    const photo = normalizeUrl(row.Photo);

    if (!name) return null;

    return {
      id: `member-${index + 1}`,
      name,
      linkedin,
      github,
      image: photo,
    };
  })
  .filter(Boolean);

const content = `export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  image?: string;
  linkedin?: string;
  github?: string;
};

export const TEAM_MEMBERS: TeamMember[] = ${JSON.stringify(teamMembers, null, 2)};
`;

fs.writeFileSync(outputPath, content + '\n');
console.log(`Imported ${teamMembers.length} students into ${path.relative(projectRoot, outputPath)}`);
