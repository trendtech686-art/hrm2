/**
 * ID Tester Component
 * 
 * Interactive ID format validator with real-time feedback
 * Used in: ID Counter Settings, Admin Tools
 */

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { validateIdFormat, ID_CONFIG } from '../../lib/id-config';
import type { EntityType } from '../../lib/id-config';

interface IDTesterProps {
  defaultEntityType?: EntityType;
  onTestResult?: (result: { valid: boolean; error?: string }) => void;
}

export function IDTester({ defaultEntityType = 'employees', onTestResult }: IDTesterProps) {
  const [testId, setTestId] = React.useState('');
  const [entityType, setEntityType] = React.useState<EntityType>(defaultEntityType);
  const [result, setResult] = React.useState<{ valid: boolean; error?: string } | null>(null);

  const handleTest = () => {
    const testResult = validateIdFormat(testId, entityType);
    setResult(testResult);
    onTestResult?.(testResult);
    
    if (testResult.valid) {
      // Optional: Could add success toast here
    }
  };

  const config = ID_CONFIG[entityType];
  const sampleId = `${config.prefix}${'0'.repeat(config.digitCount - 1)}1`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>ID Format Tester</CardTitle>
        <CardDescription>Kiểm tra định dạng ID có hợp lệ không</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Entity Type</Label>
            <select
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              value={entityType}
              onChange={(e) => setEntityType(e.target.value as EntityType)}
            >
              {Object.entries(ID_CONFIG).map(([key, conf]) => (
                <option key={key} value={key}>
                  {conf.displayName} ({conf.prefix})
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Sample Format</Label>
            <div className="h-9 rounded-md border border-input bg-muted px-3 text-sm flex items-center">
              <code>{sampleId}</code>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Test ID</Label>
          <div className="flex gap-2">
            <Input
              placeholder={`Nhập ID để test (VD: ${sampleId})`}
              value={testId}
              onChange={(e) => setTestId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTest()}
            />
            <Button onClick={handleTest}>
              Test
            </Button>
          </div>
        </div>
        
        {result && (
          <div className={`p-4 rounded-md border ${
            result.valid 
              ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
              : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
          }`}>
            <div className="flex items-center gap-2">
              {result.valid ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              )}
              <span className={`font-medium ${
                result.valid 
                  ? 'text-green-700 dark:text-green-300' 
                  : 'text-red-700 dark:text-red-300'
              }`}>
                {result.valid ? '✅ ID hợp lệ!' : `❌ ${result.error}`}
              </span>
            </div>
            
            {result.valid && (
              <div className="mt-3 space-y-1 text-sm text-green-700 dark:text-green-300">
                <p>✓ Prefix đúng: <code>{config.prefix}</code></p>
                <p>✓ Độ dài đúng: {config.digitCount} chữ số</p>
                <p>✓ Format hợp lệ</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
