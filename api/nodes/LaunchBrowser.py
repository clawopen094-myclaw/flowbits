from crawl4ai import *

async def LaunchBrowser(inputs: dict):
    inputValue = inputs.get('Website Url')
    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(
            url=inputValue,
        )
    return result.markdown
