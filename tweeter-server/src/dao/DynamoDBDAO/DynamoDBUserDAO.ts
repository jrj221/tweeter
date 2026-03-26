import { UserDTO } from "tweeter-shared";
import { UserDAO } from "../DAO";
import { DynamoDBDAO } from "./DynamoDBDAO";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

export class DynamoDBUserDAO extends DynamoDBDAO implements UserDAO {
	private _tableName = "user";
	private _userAliasAttr = "userAlias";
	private _firstNameAttr = "firstName";
	private _lastNameAttr = "lastName";
	private _imageURLAttr = "imageURL";

	async findUserByAlias(alias: string): Promise<UserDTO | null> {
		const params = {
			TableName: this._tableName,
			Key: {
				[this._userAliasAttr]: alias,
			},
		};

		const output = await this._client.send(new GetCommand(params));
		return output === undefined
			? null
			: {
					// Creates a DTO to return to the service layer
					firstName: output.Item![this._firstNameAttr],
					lastName: output.Item![this._lastNameAttr],
					alias: output.Item![this._userAliasAttr],
					imageURL: output.Item![this._imageURLAttr],
				};
	}
}
