const { Client } = require("@notionhq/client");

// Notion API設定（環境変数から取得）
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = process.env.NOTION_DB_ID;

if (!NOTION_API_KEY) {
  throw new Error("NOTION_API_KEY environment variable is required");
}

if (!DATABASE_ID) {
  throw new Error("NOTION_DB_ID environment variable is required");
}

const notion = new Client({ auth: NOTION_API_KEY });

exports.handler = async (event, context) => {
  // CORSヘッダーを設定
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS"
  };

  // OPTIONSリクエスト（プリフライト）の処理
  if (event.httpMethod === "OPTIONS") {
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
        select: {
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
        status: page.properties.Status?.select?.name || "下書き"
      };
      console.log("Processed item:", item);
      return item;
    });

    console.log("Final items count:", items.length);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: items,
        count: items.length
      }),
    };
  } catch (err) {
    console.error("Notion API Error:", err);
    console.error("Error details:", {
      message: err.message,
      code: err.code,
      status: err.status
    });
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false,
        error: err.message,
        details: {
          code: err.code,
          status: err.status
        }
      }),
    };
  }
}; 