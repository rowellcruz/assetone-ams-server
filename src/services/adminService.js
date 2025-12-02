import * as pendingRegistrationModel from "../models/pendingRegistrationModel.js";
import * as userModel from "../models/userModel.js";
import * as activityLogModel from "../models/activityLogModel.js";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

const BACKUP_DIR = path.join(process.cwd(), "backups");
const BACKUP_PATH = path.join(BACKUP_DIR, "assetone_backup.sql");
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
  
  const command = `"C:\\program files\\postgresql\\17\\bin\\pg_dump.exe" ` +
    `"postgresql://assetone_ams_db_5esl_user:ufkqNdzG2sExwrSOAn67Dm3i5pCWQ6L2@dpg-d455aohr0fns73dhcdig-a.oregon-postgres.render.com/assetone_ams_db_5esl" ` +
    `-F p -f "${backupFilePath}"`;

  return await new Promise((resolve, reject) => {
    exec(command, async (error, stdout, stderr) => {
      if (error) return reject(new Error(stderr || error.message));
      
      // Update metadata
      const metadata = readMetadata();
      const backupInfo = {
        id: Date.now().toString(),
        fileName: backupFileName,
        filePath: backupFilePath,
        timestamp: timestamp,
        size: fs.statSync(backupFilePath).size,
        createdAt: new Date().toISOString()
      };
      
      metadata.backups.unshift(backupInfo); // Add to beginning (newest first)
      metadata.latest = backupInfo;
      
      // Keep only last 10 backups (optional cleanup)
      if (metadata.backups.length > 10) {
        // Delete old backup files
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
      resolve(backupInfo); // Return backup info instead of just path
    });
  });
}

// New function to get latest backup info
export async function getLatestBackup() {
  const metadata = readMetadata();
  return metadata.latest;
}

// New function to get all backups
export async function getAllBackups() {
  const metadata = readMetadata();
  return metadata.backups;
}

// New function to get backup by id
export async function getBackupById(id) {
  const metadata = readMetadata();
  const backup = metadata.backups.find(b => b.id === id);
  if (!backup) throw new Error("Backup not found");
  return backup;
}

// Keep existing functions...
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