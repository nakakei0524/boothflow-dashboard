const { Client } = require("@notionhq/client");

// Notion API設定（環境変数から取得、フォールバック付き）
const NOTION_API_KEY = process.env.NOTION_API_KEY || "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";
const DATABASE_ID = process.env.NOTION_DB_ID || "229c750ed05980c78f08f384db78825f";

console.log("Function loaded with:");
console.log("- NOTION_API_KEY:", NOTION_API_KEY ? "SET" : "NOT SET");
console.log("- DATABASE_ID:", DATABASE_ID);

const notion = new Client({ auth: NOTION_API_KEY });

exports.handler = async (event, context) => {
  console.log("Function invoked with event:", event);
  
  // CORSヘッダーを設定
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json"
  };

  // OPTIONSリクエスト（プリフライト）の処理
  if (event.httpMethod === "OPTIONS") {
    console.log("Handling OPTIONS request");
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }

  console.log("Notion API Key:", NOTION_API_KEY.substring(0, 10) + "...");
  console.log("Database ID:", DATABASE_ID);
  
  try {
    console.log("Querying Notion database...");
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      sorts: [{ property: "Date", direction: "descending" }],
      filter: {
        property: "Status",
        status: {
          equals: "公開"
        }
      },
      page_size: 10 // 最新10件まで取得
    });

    console.log("Notion response received:", response.results.length, "items");

    const items = response.results.map((page) => {
      const item = {
        id: page.id,
        title: page.properties.Title?.title[0]?.plain_text || "（無題）",
        date: page.properties.Date?.date?.start || "不明",
        description: page.properties.Description?.rich_text[0]?.plain_text || "",
        url: page.url,
        status: page.properties.Status?.status?.name || "下書き"
      };
      console.log("Processed item:", item);
      return item;
    });

    console.log("Final items count:", items.length);

    const responseBody = {
      success: true,
      data: items,
      count: items.length
    };

    console.log("Returning response:", responseBody);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(responseBody),
    };
  } catch (err) {
    console.error("Notion API Error:", err);
    console.error("Error details:", {
      message: err.message,
      code: err.code,
      status: err.status
    });
    
    const errorResponse = {
      success: false,
      error: err.message,
      details: {
        code: err.code,
        status: err.status
      }
    };

    console.log("Returning error response:", errorResponse);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(errorResponse),
    };
  }
}; 