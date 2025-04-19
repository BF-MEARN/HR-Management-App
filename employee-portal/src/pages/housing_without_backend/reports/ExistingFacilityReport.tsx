import { memo, useState } from "react"
import { Button, TextField } from "@mui/material";
import { Comment, Report } from "../Housing";
import CommentSection from "../comments/CommentSection";

interface ExistingFacilityReportProps {
    index: number;
    title: string;
    description: string;
    timeframe: Date;
    comments: Comment[];
    setReports: React.Dispatch<React.SetStateAction<Report[]>>;
}

const ExistingFacilityReport = ({ index, title, description, timeframe, comments, setReports }: ExistingFacilityReportProps) => {
    const [currTitle, setTitle] = useState(title);
    const [currDescription, setDescription] = useState(description);
    const [edit, setEdit] = useState(false);
    const [isEdited, setIsEdited] = useState(false);
    
    const handleCancel = () => {
        setEdit(() => false);
        setTitle(() => title);
        setDescription(() => description);
    }

    const handleDelete = (index: number) => {
        setReports(prevReports => {
            const splicedReports = [...prevReports];
            splicedReports.splice(index, 1);
            console.log(splicedReports);
            return splicedReports;
        });
    }
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>, index: number) => {
        e.preventDefault();
        setReports(prevReports => {
            const editedReports = [...prevReports];
            editedReports[index].title = currTitle;
            editedReports[index].description = currDescription;
            editedReports[index].timeframe = new Date();
            return editedReports;
        })
        setEdit(() => false);
        setIsEdited(() => true);
    }
    
    const handleTurnOnEdit = () => {
        setEdit(() => true)
    }

    return (
        <>
            <hr/>

            {/* Facility Report */}
            {!edit ? 
                (
                    // UnEdited Mode
                    <>
                        {timeframe && 
                            (<div style={{fontStyle:'italic'}}>
                                {!isEdited ? 'Created' : 'Edited'} on {timeframe.toLocaleDateString()}, {timeframe.toLocaleTimeString('en-GB')}
                            </div>)
                        }
                        <h2>
                            {currTitle}
                        </h2>
                        <p>
                            {currDescription}
                        </p>
                        <Button onClick={() => handleDelete(index)}>
                            Delete
                        </Button>
                        <Button onClick={handleTurnOnEdit}>
                            Edit
                        </Button>
                    </>
                )
            :
                (
                    // Edited Mode
                    <form onSubmit={(e) => handleSubmit(e, index)}>
                        <TextField
                            label="Title"
                            name="title"
                            value={currTitle}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                        <TextField
                            label="Description"
                            name="description"
                            value={currDescription}
                            onChange={e => setDescription(e.target.value)}
                            fullWidth
                            required
                        />
                        <Button type="button" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Submit
                        </Button>
                    </form>
                )
            }

            <CommentSection
                comments={comments}
                reportIndex={index}
                setReports={setReports}
            />
        </>
    )
}

export default memo(ExistingFacilityReport);
