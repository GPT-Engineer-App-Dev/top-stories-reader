import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaArrowUp } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

const Index = () => {
  const [stories, setStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchTopStories();
  }, []);

  const fetchTopStories = async () => {
    try {
      const { data: topStoryIds } = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
      const top5StoryIds = topStoryIds.slice(0, 5);
      const storyPromises = top5StoryIds.map(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`));
      const stories = await Promise.all(storyPromises);
      setStories(stories.map(story => story.data));
    } catch (error) {
      console.error('Error fetching top stories:', error);
    }
  };

  const filteredStories = stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Hacker News Top Stories</h1>
          <div className="flex items-center">
            <span className="mr-2">Dark Mode</span>
            <Switch checked={darkMode} onCheckedChange={() => setDarkMode(!darkMode)} />
          </div>
        </div>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search stories..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="space-y-4">
          {filteredStories.map(story => (
            <Card key={story.id}>
              <CardHeader>
                <CardTitle>{story.title}</CardTitle>
                <CardDescription>
                  <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Read more
                  </a>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center">
                <FaArrowUp className="mr-2" />
                {story.score} upvotes
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;