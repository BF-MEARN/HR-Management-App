import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface Comment {
  _id: string;
  timestamp: Date;
  description: string;
  createdBy: {
    employeeId: {
      firstName: string;
      lastName: string;
      middleName?: string;
      preferredName?: string;
    };
  };
}

interface FacilityReportEntry {
  _id: string;
  title: string;
  description: string;
  status: string;
  comments: Comment[];
  updatedAt: Date;
}

interface FacilityReportState {
  facilityReports: FacilityReportEntry[];
}

const initialState: FacilityReportState = {
  facilityReports: [],
};

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
    getAllMyReports: (state, action: PayloadAction<FacilityReportEntry[]>) => {
      state.facilityReports = action.payload;
    },
    createReport: (state, action: PayloadAction<FacilityReportEntry>) => {
      state.facilityReports.push(action.payload);
    },
    updateReport: (state, action: PayloadAction<EditReportPayload>) => {
      const { reportId, newTitle, newDescription, updatedAt } = action.payload;
      const findReportIndex = state.facilityReports.findIndex((report) => report._id === reportId);
      const reportToUpdate = state.facilityReports[findReportIndex];
      Object.assign(reportToUpdate, { title: newTitle, description: newDescription, updatedAt });
    },
    deleteReport: (state, action: PayloadAction<DeleteOrCloseReportPayload>) => {
      const { reportId } = action.payload;
      const findReportIndex = state.facilityReports.findIndex((report) => report._id === reportId);
      state.facilityReports.splice(findReportIndex, 1);
    },
    closeReport: (state, action: PayloadAction<DeleteOrCloseReportPayload>) => {
      const { reportId } = action.payload;
      const findReportIndex = state.facilityReports.findIndex((report) => report._id === reportId);
      state.facilityReports[findReportIndex].status = 'Closed';
    },
    addComment: (state, action: PayloadAction<addCommentPayload>) => {
      const { reportId, newComment } = action.payload;
      const findReportIndex = state.facilityReports.findIndex((report) => report._id === reportId);
      state.facilityReports[findReportIndex].comments.push(newComment);
    },
    updateComment: (state, action: PayloadAction<updateCommentPayload>) => {
      const { reportId, commentId, newDescription, newTimestamp } = action.payload;
      const findReportIndex = state.facilityReports.findIndex((report) => report._id === reportId);
      const findCommentIndex = state.facilityReports[findReportIndex].comments.findIndex(
        (comment) => comment._id === commentId
      );
      const commentToUpdate = state.facilityReports[findReportIndex].comments[findCommentIndex];
      Object.assign(commentToUpdate, { description: newDescription, timestamp: newTimestamp });
    },
    deleteComment: (state, action: PayloadAction<deleteCommentPayload>) => {
      const { reportId, commentId } = action.payload;
      const findReportIndex = state.facilityReports.findIndex((report) => report._id === reportId);
      const commentList = state.facilityReports[findReportIndex].comments;
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
