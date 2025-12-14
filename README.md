<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

[![pre-commit-checks](https://github.com/trendtech686-art/hrm2/actions/workflows/pre-commit-checks.yml/badge.svg?branch=main)](https://github.com/trendtech686-art/hrm2/actions/workflows/pre-commit-checks.yml)

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1hCSgHDcaoyfLTVYodttucvZR1JPOudig

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

> Chuẩn hoá SystemId/BusinessId và bảng prefix đầy đủ được lưu tại [`docs/ID-GOVERNANCE.md`](docs/ID-GOVERNANCE.md). Khi thêm entity mới hoặc seed data hãy tra cứu trước để tránh lệch ID.

   ## Warranty Module Notes

   - Type dùng chung cho dialog/card bảo hành được định nghĩa tại `features/warranty/types.ts` (re-export từ `types/ui.ts` và `types/store.ts`).
   - Tài liệu nhanh: [`docs/warranty-shared-types-guide.md`](docs/warranty-shared-types-guide.md).
