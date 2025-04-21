import { FormEvent, useState } from "react";
import { Comment, Report } from "../Housing";
import { Button, TextField } from "@mui/material";

interface CommentProps {
    comment: Comment;
    index: number;
    reportIndex: number;
    setReports: React.Dispatch<React.SetStateAction<Report[]>>;
}

export default function ExistingComment ({ comment, index, reportIndex, setReports }: CommentProps) {
    const [currDescription, setCurrDescription] = useState<string>(comment.description);
    const [edit, setEdit] = useState<boolean>(false);
    const [isEdited, setIsEdited] = useState<boolean>(false);

    const handleCancel = () => {
        setEdit(() => false);
        setCurrDescription(() => comment.description);
    }

    const handleDelete = () => {
        setReports(prevReports => {
            const newReports = [...prevReports];
            newReports[reportIndex].comments = [...newReports[reportIndex].comments];
            newReports[reportIndex].comments.splice(index, 1);
            return newReports;
        })
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setReports(prevReports => {
            const newReports = [...prevReports];
            newReports[reportIndex].comments = [...newReports[reportIndex].comments];
            newReports[reportIndex].comments[index].description = currDescription;
            return newReports;
        })
        setEdit(() => false);
        setIsEdited(() => true);
    }

    const handleTurnOnEdit = () => {
        setEdit(() => true);
    }
    
    return (
        <>
            {comment && comment.timestamp && (
                <div style={{fontStyle:'italic'}}>
                    {comment.timestamp.toLocaleDateString()}, {comment.timestamp.toLocaleTimeString('en-GB')} {isEdited && '(edited)'} 
                </div>
            )}

            {!edit ? (
                    <>
                        <p>
                            {currDescription}
                        </p>
                        <Button onClick={handleDelete}>
                            Delete
                        </Button>
                        <Button onClick={handleTurnOnEdit}>
                            Edit
                        </Button>
                    </>
                )   
            :
                (
                    <form onSubmit={e => handleSubmit(e)}>
                        <TextField
                            label="Description"
                            name="description"
                            value={currDescription}
                            onChange={e => setCurrDescription(e.target.value)}
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
        </>
    )
}