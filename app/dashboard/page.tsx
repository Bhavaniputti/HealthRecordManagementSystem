
import { groqChat } from '@/lib/groq';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
export async function POST(
  request
) {

  try {

    const {

      message,

      reportId,

    } =
      await request.json();

    console.log(
      'REPORT ID:',
      reportId
    );

    /*
    =========================
    GET REPORT ANALYSIS
    =========================
    */

    const {

      data: analysis,

      error,

    } =
      await supabase
        .from(
          'report_analyses'
        )
        .select('*')
        .eq(
          'report_id',
          reportId
        )
        .single();

    console.log(
      'ANALYSIS:',
      analysis
    );

    console.log(
      'SUPABASE ERROR:',
      error
    );

    /*
    =========================
    REPORT CONTEXT
    =========================
    */

    let reportContext =
      'No report found';

    if (analysis) {

      reportContext = `

Summary:
${analysis.summary || ''}

Key Findings:
${JSON.stringify(
  analysis.key_findings || []
)}

Abnormal Values:
${JSON.stringify(
  analysis.abnormal_values || []
)}

Recommendations:
${JSON.stringify(
  analysis.recommendations || []
)}

Patient Explanation:
${analysis.patient_explanation || ''}

`;
    }

    /*
    =========================
    SYSTEM PROMPT
    =========================
    */

    const systemPrompt = `

You are HealX AI.

You help users understand medical reports.

Use ONLY this report data.

${reportContext}

Explain abnormalities clearly.

Answer in simple language.

Always recommend consulting a doctor.

`;

    /*
    =========================
    GROQ
    =========================
    */

    const response =
      await groqChat({

        messages: [

          {
            role:
              'system',

            content:
              systemPrompt,
          },

          {
            role:
              'user',

            content:
              message,
          },
        ],

        temperature: 0.3,
      });

    return Response.json({
      response,
    });

  } catch (error) {

    console.log(
      'CHAT ERROR:',
      error
    );

    return Response.json(
      {
        error:
          'Chat failed',
      },
      {
        status: 500,
      }
    );
  }
}
