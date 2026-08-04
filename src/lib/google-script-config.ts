import "server-only";

/**
 * Google Apps Script CMS — hardcoded config (no .env required).
 *
 * Editor:
 * https://script.google.com/home/projects/1_NrvcI6W4wj00KOF3LIPRME-dNKYBT1y5MzE9D5RWLgmd-hF-NTX_1Pf/edit
 *
 * Spreadsheet (Settings + Reviews):
 * https://docs.google.com/spreadsheets/d/1NAPU542Lg7DyJYYdYbNFz2JkJJTpT55sKqz1pE-rip8/edit
 * Images folder: 1DzkzYWKExb_5DjU8mnMMi7C_dmTbNPBZ
 */
export const GOOGLE_SCRIPT = {
  projectId: "AKfycbylnrCFQvKkwqE9NJn-Hwk68ixkGFW9PJX9_WzYAFjnOUnijhiagZlXiYuoI64Qjb87hA",
  spreadsheetId: "1NAPU542Lg7DyJYYdYbNFz2JkJJTpT55sKqz1pE-rip8",
  imagesFolderId: "1DzkzYWKExb_5DjU8mnMMi7C_dmTbNPBZ",

  /** Web app URL (Deploy → Manage deployments) */
  url: "https://script.google.com/macros/s/AKfycbylnrCFQvKkwqE9NJn-Hwk68ixkGFW9PJX9_WzYAFjnOUnijhiagZlXiYuoI64Qjb87hA/exec",

  /** Must match SCRIPT_SECRET in google-apps-script/Code.gs */
  secret: "d0c48e2b-6f96-4e4d-a38b-c0a3c0a7f9f1",
} as const;
