import React, { useState } from 'react';

import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Button, Collapse } from '@mui/material';

import { Comment, Report } from '../../../pages/Housing';
import CommentForm from './CommentForm';
import ExistingComment from './ExistingComment';

interface CommentSectionProps {
  comments: Comment[];
  reportIndex: number;
  setReports: React.Dispatch<React.SetStateAction<Report[]>>;
}

function CommentSection({ comments, reportIndex, setReports }: CommentSectionProps) {
  const [commentExpand, setCommentExpand] = useState<boolean>(false);

  const handleCommentExpand = () => {
    setCommentExpand((prevCommentExpand) => !prevCommentExpand);
  };

  return (
    <>
      <CommentForm reportIndex={reportIndex} setReports={setReports} />
      <br />
      {/* List of Existing Comments */}
      {comments.length > 0 && (
        <>
          <Button onClick={handleCommentExpand}>
            View {comments.length} replies {commentExpand ? <ExpandLess /> : <ExpandMore />}
          </Button>
          <Collapse in={commentExpand}>
            {comments.map((comment, index) => (
              <div key={comment.id}>
                <ExistingComment
                  comment={comment}
                  index={index}
                  reportIndex={reportIndex}
                  setReports={setReports}
                />
              </div>
            ))}
          </Collapse>
        </>
      )}
    </>
  );
}

export default CommentSection;
