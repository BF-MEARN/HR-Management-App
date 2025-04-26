import { useState } from 'react';

import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Button, Collapse, Stack } from '@mui/material';

import { Comment } from '../../../store/slices/facilityReportSlice';
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
      <Button onClick={handleCommentExpand}>
        View {comments.length} replies {commentExpand ? <ExpandLess /> : <ExpandMore />}
      </Button>
      <Collapse in={commentExpand}>
        <Stack gap={2}>
          {comments.map((comment) => (
            <ExistingComment
              key={comment._id}
              reportId={reportId}
              comment={comment}
              status={status}
            />
          ))}
        </Stack>
      </Collapse>
    </>
  );
}

export default CommentSection;
