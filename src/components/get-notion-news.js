// get-notion-news.js
const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_API_KEY });

const DATABASE_ID = process.env.NOTION_DB_ID;

exports.handler = async (event) => {
  try {
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

    const items = response.results.map((page) => ({
      id: page.id,
      title: page.properties.Title?.title[0]?.plain_text || "（無題）",
      date: page.properties.Date?.date?.start || "不明",
      description: page.properties.Description?.rich_text[0]?.plain_text || "",
      url: page.url,
      status: page.properties.Status?.select?.name || "下書き"
    }));

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, OPTIONS"
      },
      body: JSON.stringify({
        success: true,
        data: items,
        count: items.length
      }),
    };
  } catch (err) {
    console.error("Notion API Error:", err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, OPTIONS"
      },
      body: JSON.stringify({ 
        success: false,
        error: err.message 
      }),
    };
  }
};
