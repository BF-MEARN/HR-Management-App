import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface Comment {
  _id: string;
  timestamp: Date;
  description: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    preferredName?: string;
  };
}

export interface FacilityReportEntry {
  _id: string;
  title: string;
  description: string;
  status: string;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

const initialState: FacilityReportEntry[] = [];

interface EditReportPayload {
  reportId: string;
  newTitle: string;
  newDescription: string;
  updatedAt: Date;
}

interface DeleteOrCloseReportPayload {
  reportId: string;
}

interface addCommentPayload {
  reportId: string;
  newComment: Comment;
}

interface updateCommentPayload {
  reportId: string;
  commentId: string;
  newDescription: string;
  newTimestamp: Date;
}

interface deleteCommentPayload {
  reportId: string;
  commentId: string;
}

const facilityReportSlice = createSlice({
  name: 'facilityReport',
  initialState,
  reducers: {
    getAllMyReports: (_, action: PayloadAction<FacilityReportEntry[]>) => {
      return action.payload;
    },
    createReport: (state, action: PayloadAction<FacilityReportEntry>) => {
      state.push(action.payload);
    },
    updateReport: (state, action: PayloadAction<EditReportPayload>) => {
      const { reportId, newTitle, newDescription, updatedAt } = action.payload;
      const findReportIndex = state.findIndex((report) => report._id === reportId);
      const reportToUpdate = state[findReportIndex];
      Object.assign(reportToUpdate, {
        title: newTitle,
        description: newDescription,
        updatedAt,
      });
    },
    deleteReport: (state, action: PayloadAction<DeleteOrCloseReportPayload>) => {
      const { reportId } = action.payload;
      const findReportIndex = state.findIndex((report) => report._id === reportId);
      state.splice(findReportIndex, 1);
    },
    closeReport: (state, action: PayloadAction<DeleteOrCloseReportPayload>) => {
      const { reportId } = action.payload;
      const findReportIndex = state.findIndex((report) => report._id === reportId);
      state[findReportIndex].status = 'Closed';
    },
    addComment: (state, action: PayloadAction<addCommentPayload>) => {
      const { reportId, newComment } = action.payload;
      const findReportIndex = state.findIndex((report) => report._id === reportId);
      state[findReportIndex].comments.push(newComment);
      state[findReportIndex].status = 'In Progress';
    },
    updateComment: (state, action: PayloadAction<updateCommentPayload>) => {
      const { reportId, commentId, newDescription, newTimestamp } = action.payload;
      const findReportIndex = state.findIndex((report) => report._id === reportId);
      const findCommentIndex = state[findReportIndex].comments.findIndex(
        (comment) => comment._id === commentId
      );
      const commentToUpdate = state[findReportIndex].comments[findCommentIndex];
      Object.assign(commentToUpdate, { description: newDescription, timestamp: newTimestamp });
    },
    deleteComment: (state, action: PayloadAction<deleteCommentPayload>) => {
      const { reportId, commentId } = action.payload;
      const findReportIndex = state.findIndex((report) => report._id === reportId);
      const commentList = state[findReportIndex].comments;
      const findCommentIndex = commentList.findIndex((comment) => comment._id === commentId);
      commentList.splice(findCommentIndex, 1);
    },
  },
});

export const {
  getAllMyReports,
  createReport,
  updateReport,
  deleteReport,
  closeReport,
  addComment,
  updateComment,
  deleteComment,
} = facilityReportSlice.actions;
export default facilityReportSlice.reducer;
