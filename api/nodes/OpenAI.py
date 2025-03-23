from crawl4ai import *
from ..utils.agents.agent_creator import AgentCreator
from pydantic_ai import RunContext


async def OpenAI(inputs: dict):
    input = inputs.get('Input')  # Safer approach using `.get()` 
    system_message = inputs.get('System Message')
    model = inputs.get('Model')
    api_key = inputs.get('API Key')
    temperature = inputs.get('Temperature')
    stream = inputs.get('Stream')
    tools = []
    
    inputs = {
        'Model': model,
        'System Message': system_message,
        'API Key': api_key,
        'Temperature': float(temperature),
        'tools': tools,  # List tool *names* as strings
    }
    try:
        creator = AgentCreator(inputs)
        custom_agent = creator.create_agent()
        if stream == 'false':
            result = custom_agent.run_sync(input, deps='')
            return result.data
        else:
            async with custom_agent.run_stream('Where does "hello world" come from?') as result:  
                async for message in result.stream_text():
                    print(message)

        # print(result.data)
        # print(stream)
    except Exception as e:
        return (f'error: {e}')

    return False