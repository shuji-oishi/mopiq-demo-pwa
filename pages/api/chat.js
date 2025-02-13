import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// チャット履歴を保持するためのMap
const chatHistory = new Map();

const SYSTEM_PROMPT = `あなたは塗り絵アプリ「もぴっく」のアシスタントです。以下の3つのモードのいずれかを選んでユーザーの塗り絵をサポートしてください：
1. アドバイザーモード：塗り絵のコツやテクニックを教えます
2. ストーリーモード：塗り絵に物語性を持たせ、想像力を刺激します
3. アートセラピーモード：塗り絵を通じて気持ちを表現し、リラックスを促します

ユーザーの発言から適切なモードを判断し、そのモードに沿った返答をしてください。モードは途中で変更可能です。

返答は、必ずJSON形式で返してください：
{"mode": "選択したモード名", "response": "実際の返答"}

返答のテキストは、JSONとして解析可能な形式を保ちながら、自然な日本語で書いてください。`;

const FEEDBACK_PROMPT = `塗り絵の分析結果に基づいて、以下の点についてフィードバックを提供してください：
1. 色の使い方と組み合わせ
2. 塗り方の特徴や技法
3. 作品から感じられる感情や雰囲気
4. 改善点や次回に向けたアドバイス

ポジティブで建設的なフィードバックを心がけ、ユーザーの創造性を褒めながら、さらなる上達のためのヒントを提供してください。

返答は、必ずJSON形式で返してください：
{"mode": "アドバイザーモード", "response": "実際のフィードバック"}

返答のテキストは、JSONとして解析可能な形式を保ちながら、自然な日本語で書いてください。`;

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { message, sessionId = 'default', isSystemMessage = false } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(200).json({ 
          reply: `申し訳ありません。現在、AIアシスタントは利用できません。\nあなたのメッセージ: ${message}` 
        });
      }

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // 新しいチャットセッションを開始
      if (!chatHistory.has(sessionId)) {
        const chat = model.startChat();
        chatHistory.set(sessionId, chat);
        // システムプロンプトを送信
        await chat.sendMessage(SYSTEM_PROMPT);
      }

      const chat = chatHistory.get(sessionId);
      
      // 塗り絵完了時のフィードバック
      if (isSystemMessage) {
        await chat.sendMessage(FEEDBACK_PROMPT);
      }
      
      const result = await chat.sendMessage(message);
      const response = await result.response;
      const text = response.text();

      console.log('Response text before parsing:', text);
      // JSONレスポンスをパースしてモードと返答を抽出
      try {
        console.log('Response text before parsing:', text);
        const cleanedText = text.replace(/```json\s*|\s*```/g, '').trim();
        const jsonText = cleanedText.replace(/.*?({.*})/, '$1').trim();
        const parsedResponse = JSON.parse(jsonText);
        // 応答テキストから余分な改行や空白を整理
        const cleanResponse = parsedResponse.response
          .replace(/\\n/g, '\n')  // エスケープされた改行を実際の改行に
          .replace(/\n\s*\n/g, '\n')  // 複数の空行を1つに
          .trim();  // 前後の空白を削除

        res.status(200).json({
          reply: cleanResponse
        });
      } catch (parseError) {
        console.error('Parse error:', parseError);
        // JSONパースに失敗した場合は、テキスト全体を返答として使用
        const cleanText = text
          .replace(/```json/g, '')  // コードブロックの開始タグを削除
          .replace(/```/g, '')      // コードブロックの終了タグを削除
          .trim();                  // 前後の空白を削除

        res.status(200).json({
          mode: "unknown",
          reply: cleanText
        });
      }
    } catch (error) {
      console.error('Chat API error:', error);
      res.status(500).json({ 
        error: 'チャットの処理中にエラーが発生しました。',
        details: error.message 
      });
    }
  } else {
    res.status(405).end();
  }
}
