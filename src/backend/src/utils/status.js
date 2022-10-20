module.exports = {
  created () {
    return {
        id: 0,
        text: "Created"
    }
  },

  running () {
    return {
        id: 1,
        text: "Running"
    }
  },

  error () {
    return {
        id: 2,
        text: "Error"
    }
  },

  finished () {
    return {
        id: 4,
        text: "Finished"
    }
  },
  
};