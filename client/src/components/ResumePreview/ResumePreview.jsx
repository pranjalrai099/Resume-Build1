import React from 'react'
import { ClassicTemplate, ModernTemplate, MinimalTemplate, MinimalImageTemplate } from '../templates'

const ResumePreview = ({data, template, accentColor, classes=''}) => {

    const renderTemplate = ()=> {
        switch (template) {
            case "modern":
                return <ModernTemplate data={data} accentColor={accentColor}/>;
            case "minimal":
                return <MinimalTemplate data={data} accentColor={accentColor}/>;
            case "minimal-image":
                return <MinimalImageTemplate data={data} accentColor={accentColor}/>;
            default:
                return <ClassicTemplate data={data} accentColor={accentColor}/>;
        }
    };

  return (
    <div className='w-full bg-gray-100 print:bg-white'>
        <div id='resume-preview' className={'print:!border-0 print:!shadow-none print:!p-0 print:!m-0 ' + classes}>
            {renderTemplate()}
        </div>

        <style>
            {`
            @media print {
              @page {
                size: portrait;
                margin: 0;
              }
              
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              html, body {
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
              }

              /* Hide UI elements */
              .no-print {
                display: none !important;
              }

              /* Ensure the resume takes precedence */
              #resume-preview {
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
              }

              /* Template specific normalization */
              #resume-preview > div {
                max-width: none !important;
                width: 100% !important;
                margin: 0 auto !important;
                padding: 15mm 20mm !important;
                box-shadow: none !important;
                border: none !important;
              }
            }
            `}
        </style>
      
    </div>
  );
};

export default ResumePreview