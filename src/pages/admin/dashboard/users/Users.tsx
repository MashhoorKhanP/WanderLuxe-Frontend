import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/types";
import { Avatar, Box, Typography } from "@mui/material";
import { getUsers } from "../../../../actions/admin";
import { DataGrid, GridColDef, gridClasses } from "@mui/x-data-grid";
import moment from "moment";
import { grey } from "@mui/material/colors";
import UsersActions from "./UsersActions";

interface UsersProps {
  setSelectedLink: React.Dispatch<React.SetStateAction<string>>;
  link: string;
}

interface Users {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  mobileNo: string;
  email: string;
  createdAt: string | Date;
  isVerified: boolean;
  isBlocked: boolean;
}

const Users: React.FC<UsersProps> = ({ setSelectedLink, link }) => {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.admin.users);
  console.log("Users List from User.tsx", users);

  const [rowId, setRowId] = useState<string>("");
  const [selectedRowId, setSelectedRowId] = useState<string>("");

  useEffect(() => {
    setSelectedLink(link);
    // Dispatch the action to fetch users when the component mounts
    const result = dispatch(getUsers() as any);
  }, [dispatch, setSelectedLink, link]);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "profileImage",
        headerName: "Avatar",
        width: 90,
        renderCell: (params) => <Avatar src={params.row.profileImage} />,
        sortable: false,
        filterable: false,
      },
      {
        field: "firstName",
        headerName: "Name",
        width: 140,
        renderCell: (params) => (
          <div>
            {params.row.firstName} {params.row.lastName}
          </div>
        ),
      },
      { field: "email", headerName: "Email", width: 250 },
      { field: "mobile", headerName: "Mobile", width: 130 },
      {
        field: "createdAt",
        headerName: "Created At",
        width: 150,
        renderCell: (params) =>
          moment(params.row.createdAt).format("YYYY-MM-DD HH:MM:SS"),
      },
      //{ field: "_id", headerName: "User ID", type: "string", width: 110},
      {
        field: "isVerified",
        headerName: "Verified",
        width: 110,
        type: "boolean",
        editable: true,
      },
      {
        field: "isBlocked",
        headerName: "Blocked",
        width: 110,
        type: "boolean",
        editable: true,
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 130,
        type: "actions",
        renderCell: (params) => (
          <UsersActions
            {...{ params, selectedRowId, setRowId, setSelectedRowId }}
          />
        ),
      },
    ],
    [rowId, selectedRowId]
  );

  return (
    <Box sx={{ height: 400, width: "95%" }}>
      <Typography
        variant="h4"
        component="h4"
        sx={{ textAlign: "center", mt: 3, mb: 3 }}
      >
        Manage Users
      </Typography>
      <DataGrid
        columns={columns}
        rows={users as Users[]}
        getRowId={(row) => row._id}
        pageSizeOptions={[10, 25, 50, 75, 100]}
        getRowSpacing={(params) => ({
          top: params.isFirstVisible ? 0 : 5,
          bottom: params.isLastVisible ? 0 : 5,
        })}
        sx={{
          [`& .${gridClasses.row}`]: {
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? grey[200] : grey[900],
          },
        }}
        onCellEditStop={(params) => setSelectedRowId(params.id.toString())} //give on onCellEditStart
        onCellEditStart={(params) => setRowId(params.id.toString())}
      />
    </Box>
  );
};

export default Users;
