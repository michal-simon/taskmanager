<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Comment;
use App\Repositories\CommentRepository;
use Illuminate\Support\Collection;
use Illuminate\Foundation\Testing\DatabaseTransactions;


class CommentTest extends TestCase {
    
    use DatabaseTransactions;

    private $user;
    private $task;
    
    public function setUp() {
        parent::setUp();
        $this->beginDatabaseTransaction();
        $this->user = \App\User::where('is_active', 1)->first();
        $this->task = \App\Task::where('is_completed', 0)->first();
    }

    /** @test */
    public function it_can_show_all_the_comments() {
        $insertedcomment = factory(Comment::class)->create();
        $commentRepo = new CommentRepository(new Comment);
        $list = $commentRepo->listComments()->toArray();
        $myLastElement = end($list);
        // $this->assertInstanceOf(Collection::class, $list);
        $this->assertEquals($insertedcomment->toArray(), $myLastElement);
    }

    /** @test */
    public function it_can_delete_the_comment() {
        $comment = factory(Comment::class)->create();
        $commentRepo = new CommentRepository($comment);
        $deleted = $commentRepo->deleteComment($comment->id);
        $this->assertTrue($deleted);
    }

    /** @test */
    public function it_can_update_the_comment() {
        $comment = factory(Comment::class)->create();
        $data = [
            'comment' => 'unit-test'
        ];

        $commentRepo = new CommentRepository($comment);
        $updated = $commentRepo->updateComment($data);
        $found = $commentRepo->findCommentById($comment->id);
        $this->assertTrue($updated);
        $this->assertEquals($data['comment'], $found->comment);
    }

    /** @test */
    public function it_can_show_the_comment() {
        $comment = factory(Comment::class)->create();
        $commentRepo = new CommentRepository(new Comment);
        $found = $commentRepo->findCommentById($comment->id);
        $this->assertInstanceOf(Comment::class, $found);
        $this->assertEquals($comment->comment, $found->comment);
    }

    /** @test */
    public function it_can_create_a_comment() {
        $data = [
            'task_id' => $this->task->id,
            'user_id' => $this->user->id,
            'comment' => 'unit-test',
        ];

        $commentRepo = new CommentRepository(new Comment);
        $comment = $commentRepo->createComment($data);
        $this->assertInstanceOf(Comment::class, $comment);
        $this->assertEquals($data['comment'], $comment->comment);
    }

    /**
     * @codeCoverageIgnore
     */
    public function it_errors_creating_the_comment_when_required_fields_are_not_passed() {
        $this->expectException(\Illuminate\Database\QueryException::class);
        $comment = new CommentRepository(new Comment);
        $comment->createComment([]);
    }

    /** @test */
    public function it_errors_finding_a_comment() {
        $this->expectException(\Illuminate\Database\Eloquent\ModelNotFoundException::class);
        $comment = new CommentRepository(new Comment);
        $comment->findCommentById(999);
    }

    public function tearDown() {
        parent::tearDown();
    }
}
