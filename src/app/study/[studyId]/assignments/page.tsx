import Assignment, {
  Assignee,
  AssignmentContainer
} from "./assignment/assignment";
import NewAssignmentPopup from "./new_assignment_popup/new_assignment_popup";

export default function () {
  return (
    <AssignmentContainer>
      <Assignment problemId={1234} problemName="Ipsum" solvedAcTier={3}>
        <Assignee nickname="Lorem"></Assignee>
        <Assignee nickname="Lorem"></Assignee>
        <Assignee nickname="Lorem"></Assignee>
        <Assignee nickname="Lorem"></Assignee>
      </Assignment>
      <Assignment problemId={1234} problemName="Ipsum" solvedAcTier={12}>
        <Assignee nickname="Lorem"></Assignee>
        <Assignee nickname="Lorem"></Assignee>
        <Assignee nickname="Lorem"></Assignee>
        <Assignee nickname="Lorem"></Assignee>
      </Assignment>
      <Assignment problemId={1234} problemName="Ipsum" solvedAcTier={20}>
        <Assignee nickname="Lorem"></Assignee>
        <Assignee nickname="Lorem"></Assignee>
        <Assignee nickname="Lorem"></Assignee>
        <Assignee nickname="Lorem"></Assignee>
      </Assignment>
    </AssignmentContainer>
  );
}
