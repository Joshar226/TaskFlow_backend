import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";
import { hasAuthorization, projectExist } from "../middleware/project";
import { TeamController } from "../controllers/TeamController";
import { TaskController } from "../controllers/TaskController";
import { taskBelongToProject, taskExist } from "../middleware/task";
import { NoteController } from "../controllers/NoteController";

const router = Router()

router.use(authenticate)

router.param('projectId', projectExist)

// PROJECT
router.post('/',
    body('title')
        .notEmpty().withMessage('A title is required'),
    body('description')
        .notEmpty().withMessage('A description is required'),
    handleInputErrors,
    ProjectController.createProject
)

router.get('/', ProjectController.getAllProjects)

router.get('/:projectId',
    handleInputErrors,
    ProjectController.getProjectById
)

router.put('/:projectId',
    body('title')
        .notEmpty().withMessage('A title is required'),
    body('description')
        .notEmpty().withMessage('A description is required'),
    hasAuthorization,
    handleInputErrors,
    ProjectController.updateProject
)

router.delete('/:projectId',
    param('projectId').isMongoId().withMessage('Invalid ID'),
    hasAuthorization,
    handleInputErrors,
    ProjectController.deleteProject
)



router.param('taskId', taskExist)
router.param('taskId', taskBelongToProject)

// TASKS
router.post('/:projectId/task',
    hasAuthorization,
    body('title')
        .notEmpty().withMessage('A title is required'),
    body('description')
        .notEmpty().withMessage('A description is required'),
    handleInputErrors,
    TaskController.createTask
)

router.get('/:projectId/task', TaskController.getProjectTasks)

router.get('/:projectId/task/:taskId',
    param('projectId').isMongoId().withMessage('Invalid ID'),
    param('taskId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    TaskController.getTaskById
)

router.put('/:projectId/task/:taskId',
    body('title')
        .notEmpty().withMessage('A title is required'),
    body('description')
        .notEmpty().withMessage('A description is required'),
    hasAuthorization,
    handleInputErrors,
    TaskController.updateTask
)


router.post('/:projectId/task/:taskId/status',
    body('status')
        .notEmpty().withMessage('The status is required'),
    handleInputErrors,
    TaskController.updateStatus
)

router.delete('/:projectId/task/:taskId',
    param('taskId').isMongoId().withMessage('Invalid ID'),
    hasAuthorization,
    handleInputErrors,
    TaskController.deleteTask
)



// TEAM
router.post('/:projectId/team/find',
    body('email')
        .isEmail().toLowerCase().withMessage('Invalid email'),
    handleInputErrors,
    TeamController.findMember
)

router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    TeamController.addMember
)

router.get('/:projectId/team',
    hasAuthorization,
    TeamController.getProjectMembers
)

router.delete('/:projectId/team/:userId',
    param('userId')
        .isMongoId().withMessage('Invalid User'),
    TeamController.removeMember
)



// NOTES
router.post('/:projectId/task/:taskId/notes',
    body('content')
        .notEmpty().withMessage('The note cannot be empty'),
    handleInputErrors,
    NoteController.createNote
)

router.delete('/:projectId/task/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('ID no válido'),
    NoteController.deleteNote
)


export default router