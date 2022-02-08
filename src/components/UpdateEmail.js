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
			email: this.props.email,
			editable: false,
		};
	}

	handleUpdate = (email) => {
		const { rowMetatable, change } = this.props;
		const studentId = rowMetatable.rowData[0];
		// const columnIndex = rowMetatable.columnIndex;

		if (
			email.includes("@navgurukul.org") ||
			email.includes("@gmail.com") ||
			email.includes("@yahoo.com") ||
			email.includes("@hotmail.com") ||
			email.includes("@outlook.com") ||
			email.includes("@live.com") ||
			email.includes("@ymail.com") ||
			email.includes("@rediffmail.com")
		) {
			axios
				.put(`${baseUrl}students/updateEmail/${studentId}`, { email })
				.then(() => {
					console.log("Success");
					this.setState({
						editable: false,
					});
					this.props.enqueueSnackbar("Email updated successfully!", {
						variant: "success",
					});
				})
				.catch(() => {
					console.log("Failed");
					this.setState({
						editable: false,
						email: this.props.prevEmail,
					});
					this.props.enqueueSnackbar("Couldn't update email!", {
						variant: "error",
					});
				});
		} else {
			this.setState({
				email: this.props.prevEmail,
			});
			this.props.enqueueSnackbar("Invalid email!", {
				variant: "error",
			});
		}
	};

	render = () => {
		return (
			<>
				{!this.state.editable ? (
					<p
						style={{
							cursor: "pointer",
						}}
						onClick={() => {
							this.setState({
								editable: true,
							});
						}}
					>
						{this.state.email}
					</p>
				) : (
					<>
						<input
							type="text"
							value={this.state.email}
							onChange={(e) => {
								this.setState({
									email: e.target.value,
								});
							}}
						/>
						<span
							style={{
								marginLeft: "10px",
								cursor: "pointer",
							}}
							onClick={() => {
								this.handleUpdate(this.state.email);
							}}
						>
							✓
						</span>
						<span
							style={{
								marginLeft: "10px",
								cursor: "pointer",
							}}
							onClick={() => {
								this.setState({
									editable: false,
									email: this.props.prevEmail,
								});
							}}
						>
							X
						</span>
					</>
				)}
			</>
		);
	};
}

export default withSnackbar(UpdateEmail);
