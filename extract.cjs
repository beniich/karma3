const fs = require('fs');
const path = require('path');

const appPath = path.resolve('src/App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

// Export shared components
content = content.replace('const Badge = ({ children', 'export const Badge = ({ children');
content = content.replace('const Card = ({ children', 'export const Card = ({ children');
content = content.replace('const DownloadPDFButton = ({ targetId', 'export const DownloadPDFButton = ({ targetId');
content = content.replace('interface CardProps {', 'export interface CardProps {');

function extractComponent(name) {
    const regex = new RegExp('const ' + name + ' = [\\s\\S]*?\\n};\\n');
    const match = content.match(regex);
    if (match) {
        content = content.replace(regex, '');
        return match[0];
    }
    return null;
}

const profile = extractComponent('ProfileSection');
const config = extractComponent('ConfigSection');
const pricing = extractComponent('PricingSection');

// New imports to add to App.tsx
const newImports = `
import { UserSettings } from './components/dashboard/UserSettings';
import { AIControlCenter } from './features/ai-config/AIControlCenter';
import { BillingPanel } from './features/billing/BillingPanel';
`;

content = content.replace(/import \{ SovereignReportsSection \} from '\.\/components\/SovereignReportsSection';/, "import { SovereignReportsSection } from './components/SovereignReportsSection';\n" + newImports);

// Replace JSX usages
content = content.replace(/<ProfileSection/g, '<UserSettings');
content = content.replace(/<ConfigSection/g, '<AIControlCenter');
content = content.replace(/<PricingSection/g, '<BillingPanel');

fs.writeFileSync(appPath, content);

// Write components
function writeComponent(destPath, newName, oldName, source) {
    if (!source) {
        console.error('Failed to extract ' + oldName);
        return;
    }
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Find imports needed (this is a heuristic, we will add common ones)
    const imports = `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Lucide from 'lucide-react';
import { cn } from '../../lib/utils';
import { Card, Badge, DownloadPDFButton } from '../../App';
import { DashboardData, Risk, Zone, Employee, OrgNode } from '../../types';

// Unpack icons used
const { Users, Clock, ShieldAlert, Zap, FileText, Plus, Trash2, ChevronRight, BarChart3, Brain, Sparkles, RefreshCw, Save, ArrowLeft, CheckCircle2, Database, Search, Layout, TableProperties } = Lucide;
`;

    let finalSource = imports + '\n' + source.replace('const ' + oldName, 'export const ' + newName);
    fs.writeFileSync(destPath, finalSource);
}

writeComponent('src/components/dashboard/UserSettings.tsx', 'UserSettings', 'ProfileSection', profile);
writeComponent('src/features/ai-config/AIControlCenter.tsx', 'AIControlCenter', 'ConfigSection', config);
writeComponent('src/features/billing/BillingPanel.tsx', 'BillingPanel', 'PricingSection', pricing);

console.log('Extraction done.');
