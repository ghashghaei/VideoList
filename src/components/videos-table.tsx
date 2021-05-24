import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@material-ui/core';
import { ProcessedVideo } from '../common/interfaces';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useHistory
} from "react-router-dom";

interface VideosTableProps {
    videos: ProcessedVideo[];
    toDlete: any;
}

export const VideosTable: React.FC<VideosTableProps> = ({ videos, toDlete}) => {
    let history = useHistory();
    function Edit(v: number) {
        history.push("/addvideo/" + v);
    }
    return (
        <TableContainer component={Paper} style={{ marginTop: '40px' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Video Name</TableCell>
                        <TableCell>Author</TableCell>
                        <TableCell>Categories</TableCell>
                        <TableCell>Highest quality format</TableCell>
                        <TableCell>Release Date</TableCell>
                        <TableCell>Options</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {videos.map((video) => (
                        <TableRow key={video.id}>
                            <TableCell component="th" scope="row">
                                {video.name}
                            </TableCell>
                            <TableCell>{video.author}</TableCell>
                            <TableCell>{video.categories.join(', ')}</TableCell>
                            <TableCell>{video.releaseDate} </TableCell>
                            <TableCell>{video.highestqualityformat}</TableCell>
                            <TableCell>
                                <Button size="small" style={{ marginLeft: "20px" }} onClick={() => Edit(video.id)} variant="contained" color="primary">Edit</Button>
                                <Button size="small" style={{ marginLeft: "20px" }} onClick={()=> toDlete(video.id)} variant="contained" color="secondary">Delete</Button>
                            </TableCell>
                        </TableRow> 
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
