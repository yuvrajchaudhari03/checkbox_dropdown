import { TaxonomyData } from '../types/taxonomy';

export const taxonomyData: TaxonomyData = {
  categories: [
    {
      id: 'accounts-legal',
      name: 'Accounts and legal records',
      selected: false,
      expanded: false,
      subcategories: [
        {
          id: 'bookkeeping',
          name: 'Bookkeeping, financial and accounting records',
          selected: false,
          subcategories: [
            { id: 'annual-reports', name: 'Annual reports and financial statements', selected: false },
            { id: 'bank-statements', name: 'Bank statements and reconciliations', selected: false },
            { id: 'invoice-records', name: 'Invoice and billing records', selected: false },
            { id: 'tax-filings', name: 'Tax filings and supporting documents', selected: false }
          ]
        },
        {
          id: 'corporate-business',
          name: 'Corporate and business records',
          selected: false,
          subcategories: [
            { id: 'articles-incorporation', name: 'Articles of incorporation', selected: false },
            { id: 'board-resolutions', name: 'Board resolutions and minutes', selected: false },
            { id: 'shareholder-agreements', name: 'Shareholder agreements', selected: false }
          ]
        },
        {
          id: 'contracts',
          name: 'Contracts, contract performance, remedies, and notarial deeds',
          selected: false,
          subcategories: [
            { id: 'service-agreements', name: 'Service agreements', selected: false },
            { id: 'vendor-contracts', name: 'Vendor contracts', selected: false },
            { id: 'lease-agreements', name: 'Lease agreements', selected: false }
          ]
        },
        {
          id: 'contracts-related',
          name: 'Contracts related to commercial transactions',
          selected: false,
          subcategories: [
            { id: 'purchase-orders', name: 'Purchase orders', selected: false },
            { id: 'sales-contracts', name: 'Sales contracts', selected: false }
          ]
        }
      ]
    },
    {
      id: 'tax-records',
      name: 'Tax records',
      selected: false,
      expanded: false,
      subcategories: [
        {
          id: 'income-tax',
          name: 'Income tax records',
          selected: false,
          subcategories: [
            { id: 'tax-returns', name: 'Annual tax returns', selected: false },
            { id: 'tax-assessments', name: 'Tax assessments', selected: false }
          ]
        },
        {
          id: 'payroll-tax',
          name: 'Payroll tax records',
          selected: false,
          subcategories: [
            { id: 'payroll-registers', name: 'Payroll registers', selected: false },
            { id: 'tax-withholdings', name: 'Tax withholding records', selected: false }
          ]
        }
      ]
    },
    {
      id: 'hr-records',
      name: 'Human Resources (HR) records',
      selected: false,
      expanded: false,
      subcategories: [
        {
          id: 'employee-files',
          name: 'Employee personnel files',
          selected: false,
          subcategories: [
            { id: 'employment-contracts', name: 'Employment contracts', selected: false },
            { id: 'performance-reviews', name: 'Performance reviews', selected: false }
          ]
        },
        {
          id: 'payroll-hr',
          name: 'Payroll and compensation records',
          selected: false,
          subcategories: [
            { id: 'salary-records', name: 'Salary and wage records', selected: false },
            { id: 'benefits-records', name: 'Benefits enrollment records', selected: false }
          ]
        }
      ]
    },
    {
      id: 'health-safety',
      name: 'Health and safety records',
      selected: false,
      expanded: false,
      subcategories: [
        {
          id: 'incident-reports',
          name: 'Incident and accident reports',
          selected: false,
          subcategories: [
            { id: 'workplace-incidents', name: 'Workplace incident reports', selected: false },
            { id: 'safety-inspections', name: 'Safety inspection records', selected: false }
          ]
        },
        {
          id: 'training-records',
          name: 'Safety training records',
          selected: false,
          subcategories: [
            { id: 'safety-certifications', name: 'Safety certifications', selected: false },
            { id: 'training-materials', name: 'Training materials and documentation', selected: false }
          ]
        }
      ]
    },
    {
      id: 'environmental',
      name: 'Environmental records',
      selected: false,
      expanded: false,
      subcategories: [
        {
          id: 'compliance-reports',
          name: 'Environmental compliance reports',
          selected: false,
          subcategories: [
            { id: 'emissions-reports', name: 'Emissions monitoring reports', selected: false },
            { id: 'waste-management', name: 'Waste management records', selected: false }
          ]
        }
      ]
    },
    {
      id: 'transport-logistics',
      name: 'Transport and logistics records',
      selected: false,
      expanded: false,
      subcategories: [
        {
          id: 'shipping-records',
          name: 'Shipping and delivery records',
          selected: false,
          subcategories: [
            { id: 'delivery-receipts', name: 'Delivery receipts', selected: false },
            { id: 'transport-logs', name: 'Transportation logs', selected: false }
          ]
        },
        {
          id: 'vehicle-records',
          name: 'Vehicle maintenance records',
          selected: false,
          subcategories: [
            { id: 'maintenance-logs', name: 'Vehicle maintenance logs', selected: false },
            { id: 'fuel-records', name: 'Fuel and mileage records', selected: false }
          ]
        }
      ]
    },
    {
      id: 'personal-data',
      name: 'Personal data and data privacy',
      selected: false,
      expanded: false,
      subcategories: [
        {
          id: 'privacy-policies',
          name: 'Privacy policies and procedures',
          selected: false,
          subcategories: [
            { id: 'data-processing', name: 'Data processing agreements', selected: false },
            { id: 'consent-records', name: 'Consent and authorization records', selected: false }
          ]
        },
        {
          id: 'data-breach',
          name: 'Data breach and incident records',
          selected: false,
          subcategories: [
            { id: 'breach-reports', name: 'Data breach incident reports', selected: false },
            { id: 'remediation-plans', name: 'Breach remediation plans', selected: false }
          ]
        }
      ]
    }
  ]
};