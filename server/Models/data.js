const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DataEntriesSchema = Schema({
    user: String,
    roll_number: String,
    slot_number: String,
    paper_link: String
});

const DataEntries = mongoose.model("data-entries", DataEntriesSchema);

// create
const create = (entry) => {
    DataEntries.create(entry).then((data) => {
        return data;
    }).catch((err) => {
        return { message: err.message };
    })
}

// View 
const view = () => {
    DataEntries.find()
        .then((data) => {
            return data;
        }).catch((err) => {
            return { message: err.message };
        })
}


// update
const update = (query, update, options) => {
    DataEntries.findOneAndUpdate(query, update, options)
        .then((data) => {
            if (data) {
                console.log(data);
                return data
            }
            else
                console.log("No data found");
        }).catch(err => {
            return { message: err.message };
        })
}

module.exports = {
    view, update, create
};