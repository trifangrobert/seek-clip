const esClient = require("../config/elasticsearchClient");

const setupElasticsearchIndex = async () => {
    const indexName = 'videos';

    try {
        const { body: indexExists } = await esClient.indices.exists({ index: indexName });

        if (indexExists) {
            console.log('Index already exists:', indexName);
            return;
        }

        await esClient.indices.create({
            index: indexName,
            body: {
                settings: {
                    number_of_shards: 1,
                    number_of_replicas: 1
                },
                mappings: {
                    properties: {
                        title: { type: 'text', analyzer: 'standard' },
                        topic: { type: 'keyword' },
                        description: { type: 'text', analyzer: 'standard' },
                        transcription: { type: 'text', analyzer: 'standard' }
                    }
                }
            }
        });

        console.log('Index created successfully:', indexName);
    } catch (error) {
        console.error('Error creating Elasticsearch index:', error);
        throw error; 
    }
};

export default setupElasticsearchIndex;
