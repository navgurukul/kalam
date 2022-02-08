import React from "react";
import EasyEdit from "react-easy-edit";
import axios from "axios";
import { withSnackbar } from "notistack";
import { StageSelect } from "./StageSelect";
// const _ = require("underscore");

const baseUrl = process.env.API_URL;

export class UpdateEmail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			CurrentEmail: this.props.email,
		};
	}

	handleUpdate = (email) => {
		const { rowMetatable, change } = this.props;
		const studentId = rowMetatable.rowData[0];
		// const columnIndex = rowMetatable.columnIndex;
		let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
		if (regex.test(email)) {
			axios
				.put(`${baseUrl}students/updateEmail/${studentId}`, { email })
				.then(() => {
					console.log("Success");
					this.props.enqueueSnackbar("Email updated successfully!", {
						variant: "success",
					});
				})
				.catch(() => {
					console.log("Failed");
					this.props.enqueueSnackbar("Couldn't update email!", {
						variant: "error",
					});
				});
		} else {
			this.setState(
				(state, props) => {
					return {
						CurrentEmail: props.prevEmail,
					};
				},
				() => {
					this.props.enqueueSnackbar(
						"Couldn't update email! because its wrong",
						{
							variant: "error",
						}
					);
				}
			);

			console.log("Invalid email");
		}
	};

	render = () => {
		console.log("UpdateEmail props", this.props.email);
		console.log("UpdateEmail state", this.state.CurrentEmail);

		return (
			<div>
				<EasyEdit
					type="text"
					value={this.state.CurrentEmail}
					onSave={(email) => this.handleUpdate(email)}
					saveButtonLabel="✔"
					cancelButtonLabel="✖"
				/>
			</div>
		);
	};
}

export default withSnackbar(UpdateEmail);
