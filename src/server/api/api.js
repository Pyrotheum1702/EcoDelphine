const API_OPERATION = {
   LOGIN: 1,
}

async function handleCallAPI(req, res) {
   try {
      const body = req.body

      switch (req.body.operation) {
         case API_OPERATION.LOGIN: apiLogin(body, res); break;
      }
   } catch (error) { console.log('onCallAPI', error); }
}

module.exports = {
   handleCallAPI
}