from crawl4ai import *
from ..utils.agents.agent_creator import AgentCreator
import asyncio


async def GoogleGenerativeAI(inputs: dict):
    input = inputs.get('Input')  # Safer approach using `.get()` 
    system_message = inputs.get('System Message')
    model = inputs.get('Model')
    api_key = inputs.get('API Key')
    temperature = inputs.get('Temperature')
    stream = inputs.get('Stream')
    tools = ['roll_die', 'get_player_name']
    
    inputs = {
        'Model': f'google-gla:{model}',
        'System Message': system_message,
        'API Key': api_key,
        'Temperature': temperature,
        'tools': tools,  # List tool *names* as strings
    }
    print(inputs)
    
    try:
        creator = AgentCreator(inputs)
        custom_agent = creator.create_agent()
        if stream == 'false':
            result = await custom_agent.run(input, deps='')
        else:
            async with custom_agent.run_stream(input, deps='') as result:
                async for chunk in result:
                    print(chunk)

        print(result.data)
        print(stream)
    except Exception as e:
        return (f'error: {e}')

    return result.data