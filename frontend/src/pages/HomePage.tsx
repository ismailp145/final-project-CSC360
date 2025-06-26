import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Spinner } from 'react-bootstrap';
import type { Post } from '../types/Post';
import NewPost from '../modals/newPost';
import Navigation from '../components/Navigation';
import { getAllPosts, deletePost } from '../services/postService';
import { getUserProfile } from '../services/userService';
import { CommentsPanel } from '../components/CommentsPanel';

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const profile = await getUserProfile();
      setCurrentUser(profile.email);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
  };

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedPosts = await getAllPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      setError('Failed to load posts. Please try again later.');
      console.error('Error fetching posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Failed to delete post:', err);
      setError('Failed to delete post. Please try again.');
    }
  };

  const handleButtonClick = () => {
    setButtonClicked(true);
  };

  return (
    <>
      <Navigation />
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={8}>
            {/* Create Post Form */}
            {buttonClicked && (
              <NewPost posts={posts} setPosts={setPosts} />
            )}

            {isLoading ? (
              <div className="text-center my-4">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : error ? (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="mb-4">
                  <Card.Body>
                    <Card.Text>{post.content}</Card.Text>
                    {post.mediaUrl && post.mediaType === 'image' && (
                      <img src={post.mediaUrl} alt="Post media" className="img-fluid mb-3" />
                    )}
                    {post.mediaUrl && post.mediaType === 'video' && (
                      <video src={post.mediaUrl} controls className="w-100 mb-3" />
                    )}
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        Posted on {new Date(post.createdAt).toLocaleString()} by {post.userName}
                      </small>
                      {currentUser === post.userEmail && (
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                    <CommentsPanel postId={post.id} />
                  </Card.Body>
                </Card>
              ))
            )}
            <Button onClick={handleButtonClick}>Create Post</Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HomePage;
