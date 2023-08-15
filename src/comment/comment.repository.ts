import { Post } from "src/post/post.entity";
import { User } from "src/users/user.entity";
import { DataSource, EntityRepository, Repository } from "typeorm";
import { Comment } from "./comment.entity";
import { CreateCommentDto } from "./dto/createComment.dto";


@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment>{
    constructor(private dataSource: DataSource) {
        super(Comment, dataSource.createEntityManager());
    }

    async createComment(createCommentDto : CreateCommentDto, post : Post, user : User): Promise<Comment>{
        const { content } = createCommentDto;
        const comment = new Comment();
        comment.author = user;
        comment.content = content;
        comment.post = post;
        await comment.save();
        delete comment.author
        return comment;
    }
}
