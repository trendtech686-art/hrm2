<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1hCSgHDcaoyfLTVYodttucvZR1JPOudig

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

   ## Warranty Module Notes

   - Type dùng chung cho dialog/card bảo hành được định nghĩa tại `features/warranty/types.ts` (re-export từ `types/ui.ts` và `types/store.ts`).
   - Tài liệu nhanh: [`docs/warranty-shared-types-guide.md`](docs/warranty-shared-types-guide.md).
