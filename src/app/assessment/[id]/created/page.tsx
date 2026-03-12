'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button, TextInput, Modal, Checkbox } from '@worldresources/wri-design-systems';
import { CopyIcon } from '@/components/icons';
import './styles.css';

export default function AssessmentCreatedPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const assessmentId = params.id as string;
  
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [bothCopied, setBothCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    // Try to obtain the password from the URL query param on first load
    const tokenFromUrl = searchParams.get('token');

    if (typeof window === 'undefined') {
      // In non-browser environments we cannot access sessionStorage or manipulate the URL
      if (!tokenFromUrl) {
        setPasswordError(true);
      } else {
        setPassword(tokenFromUrl);
      }
      return;
    }

    if (tokenFromUrl) {
      // Store the password in sessionStorage for subsequent visits during this session
      const storageKey = `assessment-password-${assessmentId}`;
      window.sessionStorage.setItem(storageKey, tokenFromUrl);
      setPassword(tokenFromUrl);
      setPasswordError(false);

      // Remove the sensitive token from the URL to avoid it being leaked via referrers, history, etc.
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('token');
        window.history.replaceState({}, '', url.toString());
      } catch {
        // If URL manipulation fails, continue without throwing
      }

      return;
    }

    // If there is no token in the URL, attempt to restore it from sessionStorage
    const storageKey = `assessment-password-${assessmentId}`;
    const storedPassword = window.sessionStorage.getItem(storageKey);

    if (storedPassword) {
      setPassword(storedPassword);
      setPasswordError(false);
    } else {
      // No password available – mark as error so the UI can react
      setPasswordError(true);
    }
  }, [assessmentId, searchParams]);

  const assessmentLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/assessment/${assessmentId}`
    : `/assessment/${assessmentId}`;

  const handleCopyLink = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(assessmentLink);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      } else {
        // Fallback for browsers without Clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = assessmentLink;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (!success) {
          throw new Error('execCommand copy failed');
        }
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      }
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Still show copied feedback even if there's an error
      // User can manually copy from the input field
    }
  };

  const handleCopyPassword = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(password);
        setPasswordCopied(true);
        setTimeout(() => setPasswordCopied(false), 2000);
      } else {
        // Fallback for browsers without Clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = password;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (!success) {
          throw new Error('execCommand copy failed');
        }
        setPasswordCopied(true);
        setTimeout(() => setPasswordCopied(false), 2000);
      }
    } catch (error) {
      console.error('Failed to copy password:', error);
      // Still show copied feedback even if there's an error
      // User can manually copy from the input field
    }
  };

  const handleCopyBoth = async () => {
    const textToCopy = `${assessmentLink}\n${password}`;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
        setBothCopied(true);
        setTimeout(() => setBothCopied(false), 2000);
      } else {
        // Fallback for browsers without Clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (!success) {
          throw new Error('execCommand copy failed');
        }
        setBothCopied(true);
        setTimeout(() => setBothCopied(false), 2000);
      }
    } catch (error) {
      console.error('Failed to copy link and password:', error);
    }
  };

  const handleStartAssessment = () => {
    router.push(`/assessment/${assessmentId}/preparation`);
  };

  // If password is missing or expired, redirect back to setup with an error
  if (passwordError) {
    return (
      <Modal
        open={true}
        onClose={() => router.push('/assessment/setup')}
        size="medium"
        header="Session expired"
        blocking={true}
        content={
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              The access credentials for this diagnostic are no longer available. 
              Please create a new diagnostic or use your saved link and password to access an existing one.
            </p>
            <Button
              label="Back to setup"
              variant="primary"
              size="default"
              onClick={() => router.push('/assessment/setup')}
            />
          </div>
        }
      />
    );
  }

  return (
    <Modal
      open={true}
      size="medium"
      header="Save your access details"
      blocking={true}
      content={
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            This diagnostic doesn&apos;t use accounts. To keep your progress secure and return later, 
            you&apos;ll need to save both the diagnostic link and password.
          </p>

          {/* input box */}
          <div className="p-4 space-y-4 border border-slate-300 rounded-md">
              {/* diagnostic Link */}
              <div className="flex gap-1 items-end">
                <div className="flex-1 space-y-0">
                  <label className="block text-sm text-neutral-900">Diagnostic link</label>
                  <TextInput
                    value={assessmentLink}
                    disabled
                  />
                </div>
                <Button
                  variant="borderless"
                  size="default"
                  padding="0 !important"
                  leftIcon={<CopyIcon className="w-5 h-5" />}
                  onClick={handleCopyLink}
                />
              </div>

              {/* Password */}
              <div className="flex gap-1 items-end">
                <div className="flex-1 space-y-0">
                  <label className="block text-sm text-neutral-900">Password</label>
                  <TextInput
                    value={password}
                    disabled
                  />
                </div>
                <Button
                  variant="borderless"
                  size="default"
                  padding="0 !important"
                  leftIcon={<CopyIcon className="w-5 h-5" />}
                  onClick={handleCopyPassword}
                />
              </div>

              {/* Copy Both Button */}
              <div className="pt-2">
                <Button
                  variant="secondary"
                  leftIcon={<CopyIcon className="w-4 h-4" />}
                  label={bothCopied ? 'Copied!' : 'Copy link & password'}
                  onClick={handleCopyBoth}
                />
              </div>
          </div>

          {/* Confirmation Checkbox */}
          <label className="flex items-start transition-all">
            <Checkbox
              name="Checkbox"
              onCheckedChange={({checked}) => setConfirmed(Boolean(checked))}
              checked={confirmed}
            >
              I&apos;ve saved the link and password securely, and understand that if I lose these I will not be able to access the assessment.
            </Checkbox>
          </label>

          {/* Start Button */}
          <div className="pt-2">
            <Button
              label="Continue"
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