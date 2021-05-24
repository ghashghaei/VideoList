import React, { ChangeEvent, Component, ReactNode, useEffect, useState } from 'react';
import { AppBar, Container, Toolbar, Typography, Button, TextField, InputLabel, Select, Input, Chip, MenuItem, FormHelperText, Modal, makeStyles } from '@material-ui/core';
import { VideosTable } from './components/videos-table';
import { getAuthors } from './services/authors';
import { getCategories } from './services/categories';
import { getVideos } from './services/videos';
import { ProcessedVideo, Author, Category } from './common/interfaces';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useHistory
} from "react-router-dom";

const App: React.FC = () => {
    const [videos, setVideos] = useState<ProcessedVideo[]>([]);
    const [open, setOpen] = React.useState(false);
    const [toDel, setToDel] = React.useState(0);

    useEffect(() => {
        getVideos()
            .then((videos) => {
                setVideos(videos);
            });
    }, []);

    function Delete(v: number) {
        setToDel(v);
        setOpen(true);
    }
    function DoDelete() {
        setVideos(videos.filter(c => c.id != toDel));
        setOpen(false);

    }
    function addVideo(e: ProcessedVideo) {
        if (e.id == 0) {
            videos.push(e);
            setVideos(videos);
        }
        else {
            for (var i = 0; i < videos.length; i++) {
                if (videos[i].id == e.id) {
                    videos[i] = e;
                    setVideos(videos);
                }
            }
        }
    }
    return (
        <>
            <Router>
                <div >
                    <AppBar position="static">
                        <Toolbar style={{ flexGrow: 1 }}>
                            <Typography variant="h6">Videos</Typography>
                            <Link style={{ marginLeft: "20px" }} to="/"><Typography variant="subtitle1">Home</Typography></Link>
                            <Link style={{ marginLeft: "20px" }} to="/about"><Typography variant="subtitle1">About us</Typography></Link>
                            <Link style={{ marginLeft: "20px" }} to="/about"><Typography variant="subtitle1">FAQ</Typography></Link>
                            <Link style={{ marginLeft: "20px" }} to="/addvideo/0"> <Button variant="contained" style={{ marginLeft: "20px", backgroundColor: "white" }} >Add Video</Button></Link>
                        </Toolbar>

                    </AppBar>
                </div>

                <Container>
                    <Switch>
                        <Route path="/about">
                            <About />
                        </Route>
                        <Route path="/addvideo/:id">
                            <AddVideo toSave={addVideo} videos={videos} />
                        </Route>
                        <Route path="/">
                            <VideosTable toDlete={Delete} videos={videos} />
                        </Route>
                    </Switch>
                </Container>
            </Router>

            <div className="modal" style={{ display: open ? 'block' : 'none' }} >
                <div className="modal-content">
                    <span className="close">&times;</span>
                    <div>
                        Are you sure?
                  <Button onClick={() => setOpen(false)} variant="contained" color="primary">Cancel</Button>
                        <Button onClick={() => DoDelete()} variant="contained" color="secondary">Yes!</Button>
                    </div>                </div>

            </div>
        </>
    );
};

export default App;
function About() {
    return <h2>About</h2>;
};

const AddVideo: React.FC<{ videos: ProcessedVideo[], toSave: any }> = (d) => {

    let [data, setData] = useState<ProcessedVideo>({ name: '', author: '', categories: [], highestqualityformat: "", id: 0, releaseDate: "" });
    let params: any = useParams();
    const [categories, setCategories] = useState<Category[]>([]);
    const [authors, setAuthors] = useState<Category[]>([]);

    useEffect(() => {
        Promise
            .all([getCategories(), getAuthors()])
            .then(([categories, authors]) => {
                setCategories(categories)
                setAuthors(authors)
                if (d.videos && params.id != 0) {
                    let v = d.videos.find(c => c.id == params.id) as ProcessedVideo;
                    setData(v);
                }
            });

    }, []);
    function handleChange(event: { target: { name: any; value: any; }; }) {
        const { name, value } = event.target
        setData({ ...data, [name]: value })
    }
    function handleChange2(value: any, property: string) {
        setData({ ...data, [property]: value.target.value })
    }
    const history = useHistory();
    const save = () => {
        d.toSave(data);
        history.push("/");
    };
    const renderselected = (r: string[]): ReactNode => {
        return (
            <div>
                {
                    categories.filter(c => r.some(d => d == c.name)).map(
                        (value) => (
                            <Chip key={value.id} label={value.name} />
                        )
                    )
                }
            </div>
        );
    };
    return (
        <div>
            <Typography variant="h6">Add Video</Typography>
            <form noValidate autoComplete="off">
                <InputLabel >Video Name</InputLabel>
                <TextField style={{ width: '100%' }}
                    value={data.name}
                    name="name"
                    onChange={handleChange}
                    error={data.name === ""}
                    helperText={data.name === "" ? 'Empty!' : ' '}
                />

                <br />
                <br />
                <br />
                <InputLabel >Author Name</InputLabel>
                <Select style={{ width: '100%' }}
                    value={data.author}
                    input={<Input />}
                    error={data.author === ""}
                    onChange={(selected) => { handleChange2(selected, "author") }}
                >
                    {authors.map((aut) => (
                        <MenuItem key={aut.name} value={aut.name} >
                            {aut.name}
                        </MenuItem>
                    ))}
                </Select>
                {data.author === "" && <FormHelperText style={{ color: "red" }}> please select at least one category</FormHelperText>}
                <br />
                <br />
                <br />

                <InputLabel >Video Category</InputLabel>
                <Select style={{ width: '100%' }}
                    multiple
                    value={data.categories}
                    input={<Input />}
                    error={data.categories.length === 0}
                    onChange={(selected) => { handleChange2(selected, "categories") }}
                    renderValue={(selected: any) => renderselected(selected)}>
                    {categories.map((cat) => (
                        <MenuItem key={cat.name} value={cat.name} >
                            {cat.name}
                        </MenuItem>
                    ))}
                </Select>
                {data.categories.length === 0 && <FormHelperText style={{ color: "red" }}> please select at least one category</FormHelperText>}
                <Button color="primary" variant="contained" style={{ marginLeft: "20px", marginTop:"10px" }}
                    onClick={() => { save(); }}
                > Submit</Button>
                <Link style={{ marginLeft: "20px" }} to="/">
                    <Button variant="contained" style={{ marginLeft: "20px", backgroundColor: "white", marginTop:"10px" }} > Cancel</Button>
                </Link>
            </form>
        </div>
    );
};