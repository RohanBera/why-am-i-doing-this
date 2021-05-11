import React, { Component } from "react";
import Axios from "axios";
// import dates from "../dates.json";


export default class Edit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            url: "http://localhost:3001",
            updateDate: false,
            updatePaper: false,
            datesFetched: false,
            message: "",
            dates: {},
            roll_number: "",
            slot_number: "",
            paper_link: ""
        }
    }

    /**************** Event handlers *****************/


    toggleUpdate = (event) => {
        const name = event.target.name;
        this.setState({
            [name]: !this.state[name]
        })
    }

    formHandler = (event) => {
        var { name, value } = event.target;

        if (name === "roll_number") {
            value = value.toUpperCase();
        }
        this.setState({
            [name]: value
        })
    }

    formSubmit = (event) => {
        event.preventDefault();
        // console.log(this.state.formData);

        if (this.state.updateDate) {
            console.log(this.state.slot_number);

            try {
                Axios.post(this.state.url + "/entry/userDate", { id: this.state.roll_number }).then((res) => {
                    // console.log(res.data);

                    if (res.data.length === 0) {
                        this.setState({ message: "No user found! Please register first!" });
                    }
                    else {
                        if (this.state.slot_number === res.data[0].slot_number) {
                            this.setState({ message: "U already have this slot!" });
                        }
                        else {

                            // update slots
                            var query = {
                                oldDate: res.data[0].slot_number,
                                newDate: this.state.slot_number,
                            }

                            Axios.post(this.state.url + "/date/updateSlot", query).then((res) => {
                                this.setState({ message: res.data.message });
                            })

                            // update user slot
                            var updateQuery = {
                                id: this.state.roll_number,
                                update: {
                                    slot_number: this.state.slot_number,
                                }
                            };

                            Axios.post(this.state.url + "/entry/update", updateQuery).then((res) => {
                                this.setState({ message: res.data.message });
                            });
                        }

                    }
                })
            } catch (err) {
                this.setState({ message: err.message });
            }

        }

        if (this.state.updatePaper) {
            console.log(this.state.paper_link);
        }

        // Axios.post(this.state.url + "/entry/create", this.state.formData).then((res) => {
        //     console.log(res.statusText);
        //     this.setState({ message: res.data.message });

        //     if (res.data.status == 1) {
        //         Axios.post(this.state.url + "/date/bookSlot", { date: this.state.formData.slot_number }).then((res) => {
        //             console.log(res.data.message);
        //             this.setState({ message: res.data.message });
        //         })
        //     }
        // })

        // setTimeout(() => {
        //     window.location.reload(1);
        // }, 1500);

    }
    /**************** Fetch dates and slots *******************/

    fetchDates = async () => {
        Axios.get(this.state.url + "/date/view")
            .then((res) => {
                this.setState({
                    dates: res.data,
                    datesFetched: true
                });
                // console.log(this.state.dates);
            })
    }

    componentDidMount = async () => {
        this.fetchDates();
    }

    render() {
        return (
            <div className="form">
                {this.state.datesFetched ?
                    <form onSubmit={this.formSubmit}>
                        <label htmlFor="id">
                            <div className="label-title">
                                Roll number
                        </div>
                            <input
                                style={{ textTransform: "uppercase" }}
                                type="text"
                                id="id"
                                name="roll_number"
                                value={this.state.roll_number}
                                placeholder="eg : 12MCME21"
                                onChange={this.formHandler}
                                required
                            />
                        </label>

                        <hr />

                        {this.state.updateDate
                            ?
                            <div>
                                <div className="label-title">Update date</div>
                                <div className="radio-toolbar">
                                    {this.state.dates.map(date => (
                                        <div key={date._id} className="radio-button-container">
                                            <div key={date._id} className="radio-button">
                                                <input
                                                    type="radio"
                                                    id={date.date}
                                                    name="slot_number"
                                                    value={date.date}
                                                    onChange={this.formHandler}
                                                    required
                                                    disabled={date.slots === 0 ? true : false}
                                                />
                                                <label className={date.slots === 0 ? "disabled" : ""} htmlFor={date.date} >{date.date + " ( " + date.day + " )"}</label>
                                            </div>
                                            <div className="slots">
                                                {date.slots + " slots available!"}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    name="updateDate"
                                    className="submit cancel"
                                    onClick={this.toggleUpdate}
                                > Cancel</button>
                            </div>
                            :
                            <>
                                <button
                                    type="button"
                                    name="updateDate"
                                    className="submit"
                                    onClick={this.toggleUpdate}
                                > Update date</button> <br />
                            </>
                        }

                        <hr />

                        {this.state.updatePaper
                            ?
                            <div>
                                <div className="label-title">
                                    Research paper
                            </div>
                                <div className="label-body">
                                    You can attach your paper later. <br />
                                You can edit your submission later. <br />
                                </div>
                                <input
                                    type="text"
                                    id="pdf"
                                    name="paper_link"
                                    onChange={this.formHandler}
                                    placeholder="Research paper"
                                    required
                                />
                                <br />
                                <button
                                    type="button cancel"
                                    className="submit"
                                    name="updatePaper"
                                    onClick={this.toggleUpdate}
                                > Cancel</button>
                            </div>
                            :
                            <>
                                <button
                                    className="submit"
                                    name="updatePaper"
                                    onClick={this.toggleUpdate}
                                >Update paper</button> <br />
                            </>
                        }

                        <hr />

                        <input type="submit" className="submit" value="Submit" />
                        <div style={{ color: "green" }}> {this.state.message} </div>
                    </form>
                    :
                    <div>Loading...</div>
                }
            </div>
        );
    }
}
