'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, TextInput, Modal } from '@worldresources/wri-design-systems';
import { CopyIcon } from '@/components/icons';
import './styles.css';

export default function AssessmentCreatedPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const assessmentId = params.id as string;
  const password = searchParams.get('token') || '';
  
  const [linkCopied, setLinkCopied] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const assessmentLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/assessment/${assessmentId}`
    : `/assessment/${assessmentId}`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(assessmentLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleCopyPassword = async () => {
    await navigator.clipboard.writeText(password);
    setPasswordCopied(true);
    setTimeout(() => setPasswordCopied(false), 2000);
  };

  const handleStartAssessment = () => {
    router.push(`/assessment/${assessmentId}`);
  };

  return (
    <Modal
      open={true}
      onClose={() => {}} // Empty function - blocking modal
      size="xlarge"
      header="Save your access details"
      blocking={true}
      content={
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            This assessment doesn&apos;t use accounts. To keep your progress secure and return later, 
            you&apos;ll need to save both the assessment link and password.
          </p>

          {/* Assessment Link */}
          <div className="flex gap-3 items-end">
            <div className="flex-1 space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Assessment link</label>
              <TextInput
                value={assessmentLink}
                disabled
              />
            </div>
            <Button
              label={linkCopied ? 'Copied!' : 'Copy'}
              variant="secondary"
              size="default"
              leftIcon={<CopyIcon className="w-5 h-5" />}
              onClick={handleCopyLink}
            />
          </div>

          {/* Password */}
          <div className="flex gap-3 items-end">
            <div className="flex-1 space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <TextInput
                value={password}
                disabled
              />
            </div>
            <Button
              label={passwordCopied ? 'Copied!' : 'Copy'}
              variant="secondary"
              size="default"
              leftIcon={<CopyIcon className="w-5 h-5" />}
              onClick={handleCopyPassword}
            />
          </div>

          {/* Confirmation Checkbox */}
          <label className="flex items-start gap-3 p-5 rounded-2xl border-2 border-slate-100 bg-slate-50/50 cursor-pointer hover:border-primary-300 transition-all">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 leading-relaxed font-medium">
              I&apos;ve saved the link and password securely, and understand that if I lose these I will not be able to access the assessment.
            </span>
          </label>

          {/* Start Button */}
          <div className="pt-4">
            <Button
              label="Start assessment"
              variant="primary"
              size="default"
              onClick={handleStartAssessment}
              disabled={!confirmed}
            />
          </div>
        </div>
      }
    />
  );
}