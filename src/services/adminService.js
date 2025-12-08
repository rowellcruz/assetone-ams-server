import * as pendingRegistrationModel from "../models/pendingRegistrationModel.js";
import * as userModel from "../models/userModel.js";
import * as activityLogModel from "../models/activityLogModel.js";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

const BACKUP_DIR = path.join(process.cwd(), "backups");
const BACKUP_METADATA_PATH = path.join(BACKUP_DIR, "backup_metadata.json");

// Initialize backup directory and metadata file
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Initialize metadata file if it doesn't exist
if (!fs.existsSync(BACKUP_METADATA_PATH)) {
  fs.writeFileSync(BACKUP_METADATA_PATH, JSON.stringify({
    backups: [],
    latest: null
  }, null, 2));
}

// Helper function to read metadata
function readMetadata() {
  try {
    const data = fs.readFileSync(BACKUP_METADATA_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { backups: [], latest: null };
  }
}

// Helper function to write metadata
function writeMetadata(metadata) {
  fs.writeFileSync(BACKUP_METADATA_PATH, JSON.stringify(metadata, null, 2));
}

export async function backupData() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString();
  const backupFileName = `assetone_backup_${timestamp.replace(/[:.]/g, '-')}.sql`;
  const backupFilePath = path.join(BACKUP_DIR, backupFileName);
  
  // Get database URL from environment variable
  const databaseUrl = process.env.DATABASE_URL;
  
  // Determine pg_dump path based on platform
  let pgDumpCommand = 'pg_dump';
  
  // You can also check if we're on Windows
  if (process.platform === 'win32') {
    // Windows path (for local development)
    pgDumpCommand = '"C:\\program files\\postgresql\\17\\bin\\pg_dump.exe"';
  }
  // On Render (Linux), just use 'pg_dump' assuming it's in PATH
  
  const command = `${pgDumpCommand} "${databaseUrl}" -F p -f "${backupFilePath}"`;

  console.log('Running backup command:', command);
  
  return await new Promise((resolve, reject) => {
    exec(command, async (error, stdout, stderr) => {
      if (error) {
        console.error('Backup command error:', error);
        console.error('stderr:', stderr);
        console.error('stdout:', stdout);
        
        // Try alternative approach: use connection parameters directly
        if (stderr && stderr.includes('not found')) {
          console.log('Trying alternative pg_dump approach...');
          try {
            await backupWithConnectionParams(databaseUrl, backupFilePath);
            const backupInfo = createBackupInfo(backupFileName, backupFilePath);
            updateMetadata(backupInfo);
            return resolve(backupInfo);
          } catch (altError) {
            console.error('Alternative backup also failed:', altError);
          }
        }
        
        return reject(new Error(stderr || error.message));
      }
      
      console.log('Backup completed successfully');
      console.log('stdout:', stdout);
      
      const backupInfo = createBackupInfo(backupFileName, backupFilePath);
      updateMetadata(backupInfo);
      resolve(backupInfo);
    });
  });
}

// Alternative backup method using parsed connection string
async function backupWithConnectionParams(databaseUrl, backupFilePath) {
  // Parse the database URL
  const url = new URL(databaseUrl);
  const username = url.username;
  const password = url.password;
  const host = url.hostname;
  const port = url.port || '5432';
  const database = url.pathname.substring(1); // Remove leading slash
  
  // Build pg_dump command with individual parameters
  const command = `pg_dump -h ${host} -p ${port} -U ${username} -d ${database} -F p -f "${backupFilePath}"`;
  
  // Set PGPASSWORD environment variable for the child process
  const env = { ...process.env, PGPASSWORD: password };
  
  return new Promise((resolve, reject) => {
    exec(command, { env }, (error, stdout, stderr) => {
      if (error) {
        console.error('Alternative backup error:', error);
        console.error('Alternative stderr:', stderr);
        return reject(new Error(stderr || error.message));
      }
      resolve();
    });
  });
}

// Helper function to create backup info
function createBackupInfo(fileName, filePath) {
  const stats = fs.statSync(filePath);
  return {
    id: Date.now().toString(),
    fileName: fileName,
    filePath: filePath,
    timestamp: new Date().toISOString(),
    size: stats.size,
    createdAt: new Date().toISOString()
  };
}

// Helper function to update metadata
function updateMetadata(backupInfo) {
  const metadata = readMetadata();
  metadata.backups.unshift(backupInfo);
  metadata.latest = backupInfo;
  
  // Keep only last 10 backups
  if (metadata.backups.length > 10) {
    const backupsToRemove = metadata.backups.slice(10);
    backupsToRemove.forEach(backup => {
      try {
        if (fs.existsSync(backup.filePath)) {
          fs.unlinkSync(backup.filePath);
        }
      } catch (err) {
        console.error(`Failed to delete old backup: ${backup.fileName}`, err);
      }
    });
    metadata.backups = metadata.backups.slice(0, 10);
  }
  
  writeMetadata(metadata);
}

// ... rest of your existing functions remain the same
export async function getLatestBackup() {
  const metadata = readMetadata();
  return metadata.latest;
}

export async function getAllBackups() {
  const metadata = readMetadata();
  return metadata.backups;
}

export async function getBackupById(id) {
  const metadata = readMetadata();
  const backup = metadata.backups.find(b => b.id === id);
  if (!backup) throw new Error("Backup not found");
  return backup;
}

export async function getPendingRegistrations(filters = {}) {
  return await pendingRegistrationModel.getAllPending(filters);
}

export async function getActivityLog(filters = {}) {
  return await activityLogModel.getAllActivityLog(filters);
}

export async function getActivityLogById(id) {
  return await activityLogModel.getActivityLogById(id);
}

export async function getPendingRegistrationById(id) {
  const registration = await pendingRegistrationModel.getPendingRegistrationById(id);
  if (!registration) throw new Error("Registration not found");

  if (registration.status === "approved") {
    const users = await userModel.getAllUsers({ email: registration.email });
    const user = users && users.length > 0 ? users[0] : null;

    if (user) {
      return {
        ...registration,
        role: user.role,
        department: user.department_name,
      };
    }
  }

  return registration;
}