const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const moment = require('moment');
const cheerio = require('cheerio');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

// 启用CORS
app.use(cors());

// 将RSS日期格式转换为指定格式
// function formatDate(pubDate) {
//     return moment(pubDate).format('YYYY-MM-DD HH:mm:ss');
// }
function formatDate(pubDate) {
    return moment(pubDate).utcOffset('+08:00').format('YYYY-MM-DD HH:mm:ss');
}

// 从description中提取标签和内容
function extractTagsAndContent(description) {
    const $ = cheerio.load(description);
    const tags = [];

    // 提取标签
    $('span').each((i, elem) => {
        const text = $(elem).text();
        if (text.startsWith('#')) {
            const tag = text.replace('#', '').trim();
            if (tag) tags.push(tag);
        }
        // 从内容中移除标签元素
        $(elem).remove();
    });

    // 获取处理后的内容，保留图片标签
    let content = '';
    $('p').each((i, elem) => {
        content += $(elem).text().trim();
    });

    return { tags, content };
}

// 处理图片
function processImages(item) {
    let content = item.description[0];
    const images = [];

    // 处理enclosure类型的图片
    if (item.enclosure) {
        item.enclosure.forEach(enc => {
            if (enc.$.type.startsWith('image/')) {
                images.push(enc.$.url);
            }
        });
    }

    // 处理description中的图片
    const $ = cheerio.load(content);
    $('img').each((i, elem) => {
        images.push($(elem).attr('src'));
    });

    // 如果有图片，将所有图片放在同一个p标签内
    if (images.length > 0) {
        const imagesHtml = images.map(img => `<img src="${img}">`).join('');
        return `<p class="vh-img-flex">${imagesHtml}</p>`;
    }

    return '';
}

app.get('/api/talks', async (req, res) => {
    try {
        // 获取RSS数据
        const response = await axios.get(process.env.RSS_URL);

        // 解析XML
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(response.data);

        // 转换数据格式
        const items = result.rss.channel[0].item.map(item => {
            const { tags, content } = extractTagsAndContent(item.description[0]);
            const imageContent = processImages(item);

            return {
                date: formatDate(item.pubDate[0]),
                tags: tags,
                content: content + (imageContent ? imageContent : '')
            };
        });

        res.json(items);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});
