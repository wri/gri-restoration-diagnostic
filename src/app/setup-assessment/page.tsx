'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Panel,
  InlineMessage,
  Button,
  TextInput,
  Select,
  Checkbox,
  Navbar,
  Menu,
} from '@worldresources/wri-design-systems';
import {
  WriLogoIcon,
  ChevronLeftIcon,
  InfoIcon,
  LayerIcon,
  ListIcon,
  DownloadIcon,
  PersonIcon,
  EditIcon,
  CheckCircleIcon,
  ExpandMoreIcon,
} from '@/components/icons';

const languages = [
  {
    label: 'English',
    value: 'en',
  },
  {
    label: 'Spanish',
    value: 'es',
  },
];

// Country options (ISO-3166)
const countryOptions = [
  { label: 'United States', value: 'US' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'Canada', value: 'CA' },
  { label: 'Brazil', value: 'BR' },
  { label: 'Indonesia', value: 'ID' },
  { label: 'Kenya', value: 'KE' },
];

// Title options
const titleOptions = [
  { label: '--', value: '' },
  { label: 'Mr.', value: 'Mr' },
  { label: 'Ms.', value: 'Ms' },
  { label: 'Mrs.', value: 'Mrs' },
  { label: 'Dr.', value: 'Dr' },
  { label: 'Prof.', value: 'Prof' },
  { label: 'Mx.', value: 'Mx' },
];

// Geography Type options
const geographyTypeOptions = [
  { label: 'National', value: 'national' },
  { label: 'Subnational', value: 'subnational' },
  { label: 'Municipal / District', value: 'municipal_district' },
  { label: 'Transboundary Areas', value: 'transboundary' },
  { label: 'Biome / District', value: 'biome_district' },
  { label: 'Watershed / Catchment', value: 'watershed_catchment' },
  { label: 'Protected Area or Buffer Zone', value: 'protected_area' },
  { label: 'Biological Corridor', value: 'biological_corridor' },
];

// Scope options
const scopeOptions = [
  { label: 'Target landscape', value: 'target_landscape' },
  { label: 'Time horizon', value: 'time_horizon' },
  { label: 'Restoration Goals', value: 'restoration_goals' },
];

type FormData = {
  title: string;
  fullName: string;
  email: string;
  organization: string;
  role: string;
  country: string;
  subRegion: string;
  geographyType: string;
  scope: string;
  ecosystems: string[];
};

type FormErrors = {
  title?: string;
  fullName?: string;
  email?: string;
  organization?: string;
  role?: string;
  country?: string;
  subRegion?: string;
  geographyType?: string;
  scope?: string;
  ecosystems?: string;
};

export default function SetupAssessmentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<FormData>({
    title: '',
    fullName: '',
    email: '',
    organization: '',
    role: '',
    country: '',
    subRegion: '',
    geographyType: '',
    scope: '',
    ecosystems: [],
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title) {
      newErrors.title = 'Title is required';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.organization.trim()) {
      newErrors.organization = 'Organisation is required';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }

    if (!formData.country) {
      newErrors.country = 'Country is required';
    }

    if (!formData.subRegion.trim()) {
      newErrors.subRegion = 'Sub-region is required';
    }

    if (!formData.geographyType) {
      newErrors.geographyType = 'Geography type is required';
    }

    if (!formData.scope) {
      newErrors.scope = 'Scope is required';
    }

    if (formData.ecosystems.length === 0) {
      newErrors.ecosystems = 'At least one ecosystem must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      setTouched((prev) => ({ ...prev, [field]: true }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const handleCountryChange = (values: string[]) => {
    setFormData((prev) => ({ ...prev, country: values[0] || '' }));
    setTouched((prev) => ({ ...prev, country: true }));
    if (errors.country) {
      setErrors((prev) => ({ ...prev, country: undefined }));
    }
  };

  const handleTitleChange = (values: string[]) => {
    setFormData((prev) => ({ ...prev, title: values[0] || '' }));
    setTouched((prev) => ({ ...prev, title: true }));
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: undefined }));
    }
  };

  const handleGeographyTypeChange = (values: string[]) => {
    setFormData((prev) => ({ ...prev, geographyType: values[0] || '' }));
    setTouched((prev) => ({ ...prev, geographyType: true }));
    if (errors.geographyType) {
      setErrors((prev) => ({ ...prev, geographyType: undefined }));
    }
  };

  const handleScopeChange = (values: string[]) => {
    setFormData((prev) => ({ ...prev, scope: values[0] || '' }));
    setTouched((prev) => ({ ...prev, scope: true }));
    if (errors.scope) {
      setErrors((prev) => ({ ...prev, scope: undefined }));
    }
  };

  const handleSubmit = async () => {
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: API call to create assessment
      console.log('Form submitted:', formData);
      // router.push(`/assessment/${assessmentId}`);
    } catch (error) {
      console.error('Failed to create assessment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getErrorList = () => {
    const errorMessages: string[] = [];
    if (errors.title) errorMessages.push(`• ${errors.title}`);
    if (errors.fullName) errorMessages.push(`• ${errors.fullName}`);
    if (errors.email) errorMessages.push(`• ${errors.email}`);
    if (errors.organization) errorMessages.push(`• ${errors.organization}`);
    if (errors.role) errorMessages.push(`• ${errors.role}`);
    if (errors.country) errorMessages.push(`• ${errors.country}`);
    if (errors.subRegion) errorMessages.push(`• ${errors.subRegion}`);
    if (errors.geographyType) errorMessages.push(`• ${errors.geographyType}`);
    if (errors.scope) errorMessages.push(`• ${errors.scope}`);
    if (errors.ecosystems) errorMessages.push(`• ${errors.ecosystems}`);
    return errorMessages.join("\n");
  };

  const hasErrors = Object.keys(errors).length > 0;

  const header = (
    <div className="flex justify-between items-center px-4 py-3 bg-neutral-200 sm:rounded-t-lg border-b-[1px]">
      <button
        onClick={() => router.back()}
        className="flex justify-center items-center gap-1 underline text-neutral-800"
      >
        <ChevronLeftIcon />
        <span className="text-neutral-900">Back</span>
      </button>
    </div>
  );

  return (
    <>
      <Navbar 
        pathname="/setup-assessment"
        linkRouter={Link}
        logo={
          <Link href={'/'}>
            <WriLogoIcon height='auto' width='120px' />
            <span className="font-semibold ml-7">Restoration Diagnostic</span>
          </Link>
        }
        navigationSection={[]}
        utilitySection={[
          <Menu
            key='language-menu'
            label='Language'
            items={languages}
            onSelect={() => {}}
          />,
        ]}
        actionsSection={[]}
        maxWidth={1440}
        fixed
      />
      <div className="max-w-[560px] py-16 w-full flex flex-col overflow-y-auto mx-auto">
        <div>
          {/* Mobile Logo & Tag */}
          <div className="my-4 flex items-center justify-between sm:hidden px-0">
            <WriLogoIcon height="40px" width="120px" />
          </div>

          {/* Header Panel */}
          <div className="border border-gray-300 m-auto rounded-none sm:rounded-[10px] overflow-hidden mb-6 w-full">
            <Panel
              width="full"
              header={<div>{header}</div>}
              content={
                <div className="p-6">
                  <h2 className="font-bold text-[30px] leading-[28px] py-2">
                    Create a new assessment
                  </h2>
                  <div className="text-md text-gray-700 mb-6">
                    Enter your details to begin the restoration diagnostic
                    assessment.
                  </div>

                  {/* Info Widgets */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="p-4 border border-gray-300 rounded-lg flex flex-col bg-white hover:bg-neutral-50 transition-colors">
                      <LayerIcon className="text-neutral-700 mb-2" height="24px" width="24px" />
                      <span className="text-sm font-semibold">3 sections</span>
                    </div>
                    <div className="p-4 border border-gray-300 rounded-lg flex flex-col bg-white hover:bg-neutral-50 transition-colors">
                      <ListIcon className="text-neutral-700 mb-2" height="24px" width="24px" />
                      <span className="text-sm font-semibold">30 questions</span>
                    </div>
                  </div>

                  {/* Assessment Process Details */}
                  <details className="my-4 border border-gray-300 rounded-lg overflow-hidden">
                    <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-50 transition-colors list-none">
                      <div className="flex items-center gap-3">
                        <InfoIcon className="text-neutral-700" height="20px" width="20px" />
                        <span className="font-semibold text-sm">About the assessment process</span>
                      </div>
                      <ExpandMoreIcon className="text-neutral-700" height="24px" width="24px" />
                    </summary>
                    <div className="p-6 pt-0 space-y-4">
                      <div className="pt-4 border-t border-neutral-200">
                        <h3 className="font-bold text-sm mb-2">Assess key success factors</h3>
                        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                          You will be guided through a series of questions to score how well your project addresses set criteria, providing rationale and evidence for your answers.
                        </p>
                        <div className="space-y-3 bg-neutral-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center text-sm pb-3 border-b border-neutral-200">
                            <span className="flex items-center gap-2">
                              <PersonIcon className="text-neutral-700" height="18px" width="18px" />
                              <span>Motivate</span>
                            </span>
                            <span className="text-neutral-500">8 questions</span>
                          </div>
                          <div className="flex justify-between items-center text-sm pb-3 border-b border-neutral-200">
                            <span className="flex items-center gap-2">
                              <EditIcon className="text-neutral-700" height="18px" width="18px" />
                              <span>Enable</span>
                            </span>
                            <span className="text-neutral-500">13 questions</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-2">
                              <CheckCircleIcon className="text-neutral-700" height="18px" width="18px" />
                              <span>Implement</span>
                            </span>
                            <span className="text-neutral-500">9 questions</span>
                          </div>
                        </div>
                      </div>
                      <div className="pt-2">
                        <h3 className="font-bold text-sm mb-2">Create an action plan</h3>
                        <p className="text-sm text-grey-700 leading-relaxed">
                          For unmet or partially met criteria, you will be guided through a process of identifying steps to take in order to meet the relevant criteria, set to a timeline.
                        </p>
                      </div>
                    </div>
                  </details>

                  {/* Preparation Guide Widget */}
                  <div className="my-4 p-4 border border-gray-300 rounded-lg bg-white">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-[0.7]">
                        <h3 className="font-semibold text-sm mb-2">Preparation guide</h3>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          For more instructions, download the full pre-assessment preparation guide
                        </p>
                      </div>
                      <div className="flex items-center justify-center">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer">
                          <DownloadIcon className="text-neutral-700" height="18px" width="18px" />
                          <span className="text-sm font-medium">Download</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="py-2 text-sm text-gray-700">
                    Fields marked with{' '}
                    <span className="text-error-500">*</span> are required.
                  </p>
                </div>
              }
            />
          </div>

          {/* Form Sections */}
          <div className="bg-neutral-200 p-6 sm:bg-transparent sm:p-0">
            {/* Step 1: About You */}
            <div className="border border-gray-300 m-auto rounded-[10px] overflow-hidden mb-6 w-full">
              <Panel
                width="full"
                content={
                  <div className="p-6">
                    <p className="text-3xl font-bold text-neutral-800 mb-1">
                      About you
                    </p>
                    <p className="text-neutral-700 mb-6">
                      Provide some information about yourself.
                    </p>
                    <hr className="mb-6 sm:mb-8" />

                    <div className="space-y-6">
                      {/* Row 1: Title, Full Name, Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                        <div className="sm:col-span-2">
                          <Select
                            label="Title"
                            placeholder="--"
                            required
                            items={titleOptions}
                            onChange={handleTitleChange}
                          />
                        </div>
                        <div className="sm:col-span-5">
                          <TextInput
                            label="Full name"
                            placeholder="Enter full name"
                            required
                            value={formData.fullName}
                            onChange={handleInputChange('fullName')}
                            caption={touched.fullName && errors.fullName ? errors.fullName : undefined}
                          />
                        </div>
                        <div className="sm:col-span-5">
                          <TextInput
                            label="Email address"
                            type="email"
                            placeholder="name@organization.com"
                            required
                            value={formData.email}
                            onChange={handleInputChange('email')}
                            caption={touched.email && errors.email ? errors.email : undefined}
                          />
                        </div>
                      </div>

                      {/* Row 2: Organisation, Role */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <TextInput
                          label="Organisation"
                          placeholder="Your organization name"
                          required
                          value={formData.organization}
                          onChange={handleInputChange('organization')}
                          caption={
                            touched.organization && errors.organization
                              ? errors.organization
                              : undefined
                          }
                        />

                        <TextInput
                          label="Role"
                          placeholder="e.g. Project Manager"
                          required
                          value={formData.role}
                          onChange={handleInputChange('role')}
                          caption={touched.role && errors.role ? errors.role : undefined}
                        />
                      </div>
                    </div>
                  </div>
                }
              />
            </div>

            {/* Step 2: Geography */}
            <div className="border border-gray-300 m-auto rounded-[10px] overflow-hidden mb-6 w-full">
              <Panel
                width="full"
                content={
                  <div className="p-6">
                    <p className="text-3xl font-bold text-neutral-800 mb-1">
                      Geography
                    </p>
                    <p className="text-neutral-700 mb-6">
                      Enter details about the location of your restoration
                      project.
                    </p>
                    <hr className="mb-6 sm:mb-8" />

                    <div className="space-y-6">
                      {/* Row 1: Country, Sub-region */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Select
                          label="Country"
                          placeholder="Select country"
                          required
                          items={countryOptions}
                          onChange={handleCountryChange}
                        />

                        <TextInput
                          label="Sub-region / Province"
                          placeholder="Enter sub-region"
                          required
                          value={formData.subRegion}
                          onChange={handleInputChange('subRegion')}
                          caption={
                            touched.subRegion && errors.subRegion
                              ? errors.subRegion
                              : undefined
                          }
                        />
                      </div>

                      {/* Row 2: Geography Type, Scope */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Select
                          label="Geography Type"
                          placeholder="Select geography type"
                          required
                          items={geographyTypeOptions}
                          onChange={handleGeographyTypeChange}
                        />

                        <Select
                          label="Scope"
                          placeholder="Select scope"
                          required
                          items={scopeOptions}
                          onChange={handleScopeChange}
                        />
                      </div>

                      <hr className="my-6 sm:my-8" />

                      <div>
                        <label className="block text-sm font-semibold mb-1">
                          <span className="text-error-500">*</span> Ecosystem context
                        </label>
                        <p className="text-xs text-gray-700 mb-4">
                          Select all ecosystem types present in your assessment area.
                        </p>
                      </div>
                      <div className="space-y-3">
                        {[
                          { id: 'forest', label: 'Forest', desc: 'Tropical, temperate, or boreal forest ecosystems' },
                          { id: 'grassland', label: 'Grassland', desc: 'Savannas, prairies, and steppes' },
                          { id: 'wetland', label: 'Wetland', desc: 'Marshes, swamps, and floodplains' },
                          { id: 'coastal', label: 'Coastal', desc: 'Mangroves, estuaries, and coastal zones' },
                          { id: 'peatland', label: 'Peatland', desc: 'Bogs, fens, and peat swamp forests' },
                        ].map((ecosystem) => (
                          <label
                            key={ecosystem.id}
                            className={`
                              relative block cursor-pointer p-4 border rounded-lg bg-white
                              transition-all hover:border-neutral-400
                              ${formData.ecosystems.includes(ecosystem.id) ? 'border-primary-500 bg-primary-50' : 'border-neutral-300'}
                            `}
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={formData.ecosystems.includes(ecosystem.id)}
                                onCheckedChange={(checked) => {
                                  const newEcosystems = checked
                                    ? [...formData.ecosystems, ecosystem.id]
                                    : formData.ecosystems.filter((id) => id !== ecosystem.id);
                                  setFormData((prev) => ({ ...prev, ecosystems: newEcosystems }));
                                  setTouched((prev) => ({ ...prev, ecosystems: true }));
                                  if (errors.ecosystems) {
                                    setErrors((prev) => ({ ...prev, ecosystems: undefined }));
                                  }
                                }}
                              />
                              <div className="flex-1">
                                <p className="text-sm font-semibold">{ecosystem.label}</p>
                                <p className="text-xs text-gray-700">{ecosystem.desc}</p>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                      {touched.ecosystems && errors.ecosystems && (
                        <p className="text-sm text-error-500 mt-2">
                          {errors.ecosystems}
                        </p>
                      )}
                    </div>
                  </div>
                }
              />
            </div>
          </div>

          {/* Footer: Errors & Submit */}
          <div className="m-auto bg-neutral-200 px-6 sm:bg-transparent sm:p-0 mb-16">
            {hasErrors && (
              <div className="mb-4">
                <InlineMessage
                  variant="error"
                  label="There are errors in the form:"
                  caption={getErrorList()}
                />
              </div>
            )}
            <Button
              label="Start assessment"
              variant="primary"
              onClick={handleSubmit}
              loading={isSubmitting}
            />
          </div>
        </div>
      </div>
    </>
  );
}
