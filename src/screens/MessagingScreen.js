import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  MessageCircle,
  Send,
  Search,
  User,
  Plus,
  ChevronLeft,
  MoreVertical,
  Video,
  Image as ImageIcon,
} from "lucide-react-native";
import { api } from "../api";
import { theme } from "../constants/theme";

const MessagingScreen = ({ route }) => {
  const navigation = useNavigation();
  const { conversationId, recipientUsername } = route?.params || {};
  
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);

  const messagesEndRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadConversations();
    if (conversationId) {
      loadMessages(conversationId);
    } else if (recipientUsername) {
      handleStartConversation(recipientUsername);
    }
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await api.getConversations();
      if (response.isSuccess) {
        setConversations(response.conversations);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (convId) => {
    try {
      const response = await api.getMessages(convId);
      if (response.isSuccess) {
        setMessages(response.messages);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleStartConversation = async (username) => {
    try {
      const response = await api.createConversation(username);
      if (response.isSuccess) {
        setCurrentConversation(response.conversation);
        setShowNewChat(false);
        setShowSearch(false);
        loadConversations();
        if (response.conversation.id) {
          loadMessages(response.conversation.id);
        }
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || sending) return;

    const text = messageText.trim();
    setMessageText("");

    try {
      setSending(true);
      const recipient = currentConversation?.other_user?.username || recipientUsername;
      const response = await api.sendMessage(recipient, text);
      
      if (response.isSuccess) {
        setMessages([...messages, response.message]);
        loadConversations(); // Refresh to update last message
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessageText(text); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const handleSearchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await api.searchUsers(query);
      if (response.isSuccess) {
        setSearchResults(response.users);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const handleSelectConversation = (conversation) => {
    setCurrentConversation(conversation);
    loadMessages(conversation.id);
  };

  const renderConversationItem = ({ item }) => {
    const isActive = currentConversation?.id === item.id;

    return (
      <TouchableOpacity
        style={[styles.conversationItem, isActive && styles.conversationItemActive]}
        onPress={() => handleSelectConversation(item)}
      >
        <View style={styles.conversationAvatar}>
          <User size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.conversationName}>
              {item.other_user?.name || item.other_user?.username || "Unknown"}
            </Text>
            {item.unread_count > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unread_count}</Text>
              </View>
            )}
          </View>
          <Text style={styles.conversationPreview} numberOfLines={1}>
            {item.last_message?.text || "No messages yet"}
          </Text>
        </View>
        <Text style={styles.conversationTime}>
          {item.last_message?.created_at
            ? new Date(item.last_message.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.sender_username !== currentConversation?.other_user?.username;
    const isReel = item.message_type === "reel";
    const isImage = item.message_type === "image";

    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessage : styles.otherMessage,
        ]}
      >
        {!isMyMessage && (
          <View style={styles.messageAvatar}>
            <User size={16} color={theme.colors.primary} />
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
          ]}
        >
          {isReel && (
            <View style={styles.reelPreview}>
              <Video size={20} color={theme.colors.textPrimary} />
              <Text style={styles.reelPreviewText}>Reel shared</Text>
            </View>
          )}
          {isImage && (
            <View style={styles.imagePreview}>
              <ImageIcon size={20} color={theme.colors.textPrimary} />
              <Text style={styles.imagePreviewText}>Image shared</Text>
            </View>
          )}
          <Text
            style={[
              styles.messageText,
              isMyMessage ? styles.myMessageText : styles.otherMessageText,
            ]}
          >
            {item.text}
          </Text>
          <Text
            style={[
              styles.messageTime,
              isMyMessage ? styles.myMessageTime : styles.otherMessageTime,
            ]}
          >
            {new Date(item.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  };

  const renderSearchResults = () => (
    <View style={styles.searchResults}>
      {searchResults.map((user) => (
        <TouchableOpacity
          key={user.username}
          style={styles.searchResultItem}
          onPress={() => handleStartConversation(user.username)}
        >
          <View style={styles.searchResultAvatar}>
            <User size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.searchResultContent}>
            <Text style={styles.searchResultName}>
              {user.name || user.username}
            </Text>
            <Text style={styles.searchResultUsername}>@{user.username}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (loading && conversations.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => {
              if (currentConversation) {
                setCurrentConversation(null);
              } else {
                navigation.goBack();
              }
            }}
          >
            <ChevronLeft size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <MessageCircle size={24} color={theme.colors.primary} />
            <Text style={styles.headerTitle}>
              {currentConversation ? "Messages" : "Conversations"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => {
              setShowNewChat(!showNewChat);
              setShowSearch(!showSearch);
            }}
          >
            <Plus size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {currentConversation ? (
          // Chat View
          <View style={styles.chatContainer}>
            <FlatList
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.messagesList}
              ref={messagesEndRef}
              onContentSizeChange={() =>
                messagesEndRef.current?.scrollToEnd({ animated: true })
              }
            />

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.messageInput}
                placeholder="Type a message..."
                placeholderTextColor={theme.colors.textMuted}
                value={messageText}
                onChangeText={setMessageText}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!messageText.trim() || sending) && styles.sendButtonDisabled,
                ]}
                onPress={handleSendMessage}
                disabled={!messageText.trim() || sending}
              >
                {sending ? (
                  <ActivityIndicator size="small" color={theme.colors.textPrimary} />
                ) : (
                  <Send size={20} color={theme.colors.textPrimary} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // Conversations List
          <View style={styles.conversationsContainer}>
            {showSearch && (
              <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                  <Search size={20} color={theme.colors.textSecondary} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search users..."
                    placeholderTextColor={theme.colors.textMuted}
                    value={searchQuery}
                    onChangeText={(text) => {
                      setSearchQuery(text);
                      handleSearchUsers(text);
                    }}
                  />
                </View>
                {searchQuery && renderSearchResults()}
              </View>
            )}

            {conversations.length > 0 ? (
              <FlatList
                data={conversations}
                renderItem={renderConversationItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.conversationsList}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <MessageCircle size={64} color={theme.colors.textMuted} />
                <Text style={styles.emptyText}>No conversations yet</Text>
                <Text style={styles.emptySubtext}>
                  Start a new conversation to connect with others!
                </Text>
                <TouchableOpacity
                  style={styles.newChatButton}
                  onPress={() => {
                    setShowNewChat(true);
                    setShowSearch(true);
                  }}
                >
                  <Plus size={20} color={theme.colors.textPrimary} />
                  <Text style={styles.newChatButtonText}>New Chat</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerButton: {
    padding: theme.spacing.sm,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  headerTitle: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
  },
  conversationsContainer: {
    flex: 1,
  },
  searchContainer: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  searchResults: {
    marginTop: theme.spacing.md,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  searchResultAvatar: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  searchResultContent: {
    flex: 1,
  },
  searchResultName: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  searchResultUsername: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
  },
  conversationsList: {
    padding: theme.spacing.md,
  },
  conversationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  conversationItemActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "20",
  },
  conversationAvatar: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  conversationName: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  unreadBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.round,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
  },
  unreadText: {
    ...theme.typography.caption,
    color: theme.colors.textPrimary,
    fontWeight: "700",
  },
  conversationPreview: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  conversationTime: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    padding: theme.spacing.md,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: theme.spacing.sm,
    alignItems: "flex-end",
  },
  myMessage: {
    justifyContent: "flex-end",
  },
  otherMessage: {
    justifyContent: "flex-start",
  },
  messageAvatar: {
    width: 24,
    height: 24,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.xs,
  },
  messageBubble: {
    maxWidth: "75%",
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  myMessageBubble: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: theme.borderRadius.xs,
  },
  otherMessageBubble: {
    backgroundColor: theme.colors.backgroundCard,
    borderBottomLeftRadius: theme.borderRadius.xs,
  },
  messageText: {
    ...theme.typography.body,
  },
  myMessageText: {
    color: theme.colors.textPrimary,
  },
  otherMessageText: {
    color: theme.colors.textPrimary,
  },
  messageTime: {
    ...theme.typography.caption,
    marginTop: theme.spacing.xs,
  },
  myMessageTime: {
    color: theme.colors.textPrimary + "CC",
  },
  otherMessageTime: {
    color: theme.colors.textMuted,
  },
  reelPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary + "80",
    borderRadius: theme.borderRadius.md,
  },
  reelPreviewText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
  },
  imagePreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary + "80",
    borderRadius: theme.borderRadius.md,
  },
  imagePreviewText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundSecondary,
    gap: theme.spacing.sm,
  },
  messageInput: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  emptyText: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  emptySubtext: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  newChatButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  newChatButtonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
  },
});

export default MessagingScreen;

