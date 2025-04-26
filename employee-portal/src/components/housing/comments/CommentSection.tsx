import { useState } from 'react';

import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Button, Collapse } from '@mui/material';

import { Comment } from '../../../store/slices/facilityReportSlice';
import CommentForm from './CommentForm';
import ExistingComment from './ExistingComment';

function CommentSection({
  reportId,
  comments,
  status,
}: {
  reportId: string;
  comments: Comment[];
  status: string;
}) {
  const [commentExpand, setCommentExpand] = useState<boolean>(false);

  const handleCommentExpand = () => {
    setCommentExpand((prevCommentExpand) => !prevCommentExpand);
  };

  return (
    <>
      <CommentForm reportId={reportId} status={status} />
      <br />
      {/* List of Existing Comments */}
      {comments && comments.length > 0 && (
        <>
          <Button onClick={handleCommentExpand}>
            View {comments.length} replies {commentExpand ? <ExpandLess /> : <ExpandMore />}
          </Button>
          <Collapse
            in={commentExpand}
            sx={{
              fontSize: '15px',
              marginLeft: '40px',
            }}
          >
            {comments.map((comment) => (
              <div key={comment._id}>
                <ExistingComment reportId={reportId} comment={comment} status={status} />
              </div>
            ))}
          </Collapse>
        </>
      )}
    </>
  );
}

export default CommentSection;
