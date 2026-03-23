import type { ProductDetail } from "@/types/data/products";

export const detailPresets: Record<string, ProductDetail[]> = {
  "鍵盤": [
    {
      section: "規格與詳細資訊",
      content: [
        {
          title: "按鍵軸體與輸入表現",
          text: [
            "採用機械軸設計，提供清晰回饋與快速觸發體驗",
            "支援全鍵無衝突輸入，能在激烈對戰中保持穩定操作",
            "適合 FPS、MOBA 與日常高頻率打字使用",
          ],
        },
        {
          title: "RGB 燈效與自訂功能",
          text: [
            "支援 RGB 燈效系統，可自訂多種發光模式",
            "可透過軟體進行每鍵燈光調整與巨集設定",
            "可依照遊戲情境或桌面風格建立個人化配置",
          ],
        },
      ],
    },
    {
      section: "連接與相容性",
      content: [
        {
          title: "連接方式",
          text: [
            "採用有線 USB-C 連接，提供穩定低延遲傳輸",
            "適合重視即時反應與穩定性的遊戲玩家",
          ],
        },
      ],
    },
  ],

  "滑鼠": [
    {
      section: "規格與詳細資訊",
      content: [
        {
          title: "感應器與操作表現",
          text: [
            "搭載高精度感應器，提供穩定追蹤與快速反應",
            "適合射擊、MOBA 與日常操作使用",
          ],
        },
      ],
    },
  ],

  "耳機": [
    {
      section: "規格與詳細資訊",
      content: [
        {
          title: "音效表現",
          text: [
            "提供清晰定位與沉浸式音場體驗",
            "適合遊戲、影音與語音通話使用",
          ],
        },
      ],
    },
  ],

  "麥克風": [
    {
      section: "規格與詳細資訊",
      content: [
        {
          title: "收音與用途",
          text: [
            "提供清晰收音表現，適合直播、會議與錄音使用",
            "支援基本降噪與穩定語音輸出",
          ],
        },
      ],
    },
  ],

  "喇叭": [
    {
      section: "規格與詳細資訊",
      content: [
        {
          title: "音場與輸出",
          text: [
            "提供飽滿音效與清楚人聲表現",
            "適合桌面娛樂、遊戲與日常聆聽使用",
          ],
        },
      ],
    },
  ],
};
