"use client";

import { useApp } from "@/lib/store/app-context";
import {
  Calendar,
  CheckCheck,
  ChevronLeft,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MessagesViewProps {
  initialBookingId?: string;
  onNavigate: (tab: string, param?: string) => void;
}

export function MessagesView({
  initialBookingId,
  onNavigate,
}: MessagesViewProps) {
  const { currentUser, bookings, messages, sendMessage, markMessagesRead } =
    useApp();

  // Find all bookings involving this user
  const relevantBookings = bookings.filter((b) =>
    currentUser.role === "customer"
      ? b.customer_id === currentUser.id
      : b.photographer_id === currentUser.id,
  );

  const [selectedBookingId, setSelectedBookingId] = useState<string>(
    initialBookingId || relevantBookings[0]?.id || "",
  );
  const [inputText, setInputText] = useState("");
  const [showMobileList, setShowMobileList] = useState(!initialBookingId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeBooking =
    relevantBookings.find((b) => b.id === selectedBookingId) ||
    relevantBookings[0];
  const activeMessages = messages.filter(
    (m) => m.booking_id === activeBooking?.id,
  );

  useEffect(() => {
    if (activeBooking?.id) {
      markMessagesRead(activeBooking.id);
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedBookingId, activeBooking?.id, markMessagesRead]);

  const handleSendMessage = (textToSend?: string) => {
    const content = textToSend || inputText;
    if (!content.trim() || !activeBooking) return;

    sendMessage(activeBooking.id, content.trim());
    setInputText("");
  };

  const quickPrompts = [
    "Can we capture couple portraits during sunset golden hour?",
    "Do we need special permits for the outdoor heritage lawns?",
    "What time will the dual second shooter arrive at the venue?",
    "Could we review the recommended family shot list together?",
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-20 md:pb-6 text-[#1A1A1A]">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="h-[750px] overflow-hidden rounded-3xl border border-[#D9D2C2] bg-white shadow-xl grid grid-cols-1 md:grid-cols-12">
          {/* Left Conversations Sidebar (Image 11 layout) */}
          <div
            className={`border-r border-[#E8E2D2] bg-[#FBF9F5] md:col-span-4 flex flex-col ${
              showMobileList ? "block" : "hidden md:flex"
            }`}
          >
            <div className="border-b border-[#E8E2D2] p-4 bg-white">
              <h2 className=" text-lg font-bold text-[#1A1A1A]">
                Artist Direct Desks
              </h2>
              <p className="text-[11px] text-[#767471]">
                Real-time communications for your active commission orders
              </p>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#F0ECE1]">
              {relevantBookings.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#767471]">
                  No active conversations. Request a booking to start chatting
                  with artists!
                </div>
              ) : (
                relevantBookings.map((b) => {
                  const partnerName =
                    currentUser.role === "customer"
                      ? b.photographer_name
                      : b.customer_name;
                  const partnerImage =
                    currentUser.role === "customer" ? b.photographer_image : "";
                  const bookingMsgs = messages.filter(
                    (m) => m.booking_id === b.id,
                  );
                  const lastMsg = bookingMsgs[bookingMsgs.length - 1];
                  const isSelected = b.id === activeBooking?.id;

                  return (
                    <div
                      key={b.id}
                      onClick={() => {
                        setSelectedBookingId(b.id);
                        setShowMobileList(false);
                      }}
                      className={`cursor-pointer p-4 transition ${
                        isSelected
                          ? "bg-white border-l-4 border-[#C59B27] shadow-xs"
                          : "hover:bg-[#F0ECE1]/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          {partnerImage ? (
                            <img
                              src={partnerImage}
                              alt={partnerName}
                              className="h-11 w-11 rounded-full object-cover ring-1 ring-[#D9D2C2]"
                            />
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1A1A1A] text-xs font-bold text-[#C59B27] ring-1 ring-[#D9D2C2]">
                              {partnerName?.charAt(0) || "U"}
                            </div>
                          )}
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#2D6A4F]" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className=" text-xs font-bold text-[#1A1A1A] truncate">
                              {partnerName}
                            </h4>
                            <span
                              suppressHydrationWarning
                              className="text-[10px] text-[#767471]"
                            >
                              {lastMsg
                                ? new Date(
                                    lastMsg.created_at,
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : ""}
                            </span>
                          </div>

                          <div className="text-[10px] font-semibold text-[#997316] truncate">
                            {b.package_name} • {b.event_date}
                          </div>

                          <p className="mt-1 text-xs text-[#52504E] truncate">
                            {lastMsg
                              ? lastMsg.content
                              : "Session initialized. Say hello!"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Main Chat Window */}
          {activeBooking ? (
            <div
              className={`flex-1 flex flex-col md:col-span-8 bg-white ${
                showMobileList ? "hidden md:flex" : "flex"
              }`}
            >
              {/* Chat Header matching Image 11 */}
              <div className="flex items-center justify-between border-b border-[#E8E2D2] px-4 py-3 sm:px-6 bg-[#FBF9F5]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowMobileList(true)}
                    className="md:hidden rounded-lg p-1 text-[#767471] hover:bg-[#F0ECE1]"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {currentUser.role === "customer" &&
                  activeBooking.photographer_image ? (
                    <img
                      src={activeBooking.photographer_image}
                      alt="Chat partner"
                      className="h-10 w-10 rounded-full object-cover ring-1 ring-[#C59B27]"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A1A1A] text-xs font-bold text-[#C59B27] ring-1 ring-[#C59B27]">
                      {(currentUser.role === "customer"
                        ? activeBooking.photographer_name
                        : activeBooking.customer_name
                      )?.charAt(0) || "U"}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className=" text-sm font-bold text-[#1A1A1A]">
                        {currentUser.role === "customer"
                          ? activeBooking.photographer_name
                          : activeBooking.customer_name}
                      </h3>
                      <ShieldCheck className="h-4 w-4 text-[#2D6A4F]" />
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#767471]">
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#2D6A4F]" />{" "}
                        Active Now
                      </span>
                      <span>•</span>
                      <span>Ref: {activeBooking.booking_code}</span>
                    </div>
                  </div>
                </div>

                {/* Booking Context Pill */}
                <div className="hidden sm:flex items-center gap-2 rounded-xl border border-[#E8E2D2] bg-white px-3 py-1.5 text-xs text-[#52504E]">
                  <Calendar className="h-3.5 w-3.5 text-[#C59B27]" />
                  <span>{activeBooking.event_date}</span>
                  <span>•</span>
                  <span className="font-bold text-[#1A1A1A]">
                    ₹{activeBooking.total_price.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Chat Thread Messages */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FBF9F5]/40">
                {activeMessages.length === 0 ? (
                  <div className="py-12 text-center">
                    <Sparkles className="mx-auto h-8 w-8 text-[#C59B27]" />
                    <p className="mt-2  text-sm font-bold text-[#1A1A1A]">
                      Direct Atelier Conversation
                    </p>
                    <p className="text-xs text-[#767471] max-w-sm mx-auto mt-1">
                      Discuss schedule timing, shot ideas, family groupings, or
                      special lighting requirements directly.
                    </p>
                  </div>
                ) : (
                  activeMessages.map((msg) => {
                    const isMe = msg.sender_id === currentUser.id;

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-xs ${
                            isMe
                              ? "bg-[#1A1A1A] text-[#FBF9F5] rounded-br-xs"
                              : "bg-white border border-[#E8E2D2] text-[#1A1A1A] rounded-bl-xs"
                          }`}
                        >
                          <p>{msg.content}</p>
                          <div
                            className={`mt-1 flex items-center justify-end gap-1 text-[9px] ${
                              isMe ? "text-[#A6A4A0]" : "text-[#767471]"
                            }`}
                          >
                            <span suppressHydrationWarning>
                              {new Date(msg.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {isMe && (
                              <CheckCheck className="h-3 w-3 text-[#C59B27]" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Bar */}
              <div className="border-t border-[#F0ECE1] bg-white px-4 py-2 overflow-x-auto flex gap-2">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    className="shrink-0 rounded-full border border-[#D9D2C2] bg-[#FBF9F5] px-3 py-1 text-[11px] text-[#52504E] hover:border-[#C59B27] hover:text-[#1A1A1A] transition"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Row */}
              <div className="border-t border-[#E8E2D2] p-3 sm:p-4 bg-white flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                  placeholder="Type your message to the artist..."
                  className="flex-1 rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] px-4 py-2.5 text-xs text-[#1A1A1A] placeholder-[#767471] focus:outline-none focus:border-[#C59B27]"
                />

                <button
                  id="send-message-btn"
                  onClick={() => handleSendMessage()}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A1A1A] text-white hover:bg-[#333] transition shadow-xs"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4 text-[#C59B27]" />
                </button>
              </div>
            </div>
          ) : (
            <div className="md:col-span-8 flex items-center justify-center p-12 text-center text-xs text-[#767471]">
              Select a conversation from the left to start messaging.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
