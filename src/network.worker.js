import Data from './data'
import Network from './network';
let network;

const trainIfNeeded = (networkConfig) => {
    if (!networkConfig) {
        console.log('train');
        return network.train()
    } else {
        network = new Network(networkConfig.learningRate, networkConfig.batchSize, networkConfig.epochs);
        network.setupNetwork();
        network.setData(new Data(networkConfig.trainingData));
        return Promise.resolve({loss: 0, accuracy: 0})
    }
};

onmessage = function(e) {
    let loss;
    let accuracy;
    let input;
    console.log(e.data[0]);
    return trainIfNeeded(e.data[0])
        .then((result) => {
            console.log('training result', result);
            loss = result.loss;
            accuracy = result.accuracy;

            input = Data.normalize(e.data[1]);
            return network.predict(input)
        })
        .then(prediction => {
            console.log('prediction', prediction);
            input = Data.denormalize(input);
            prediction = Data.denormalize(prediction);
            postMessage({input, prediction, loss});
        })
        .catch(err => {
            console.log('error', err);
        })

};

